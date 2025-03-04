import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PowerScheduler } from './power_scheduler.entity';
import { PowerSchedulerService } from './power_scheduler.service';
import { DomainService } from '../domain/domain.service';
import { DeviceTypeService } from '../device_type/device_type.service';
import { DeviceDataService } from '../device_data/device_data.service';
import { AppService } from 'src/app.service';
import { Util } from 'src/util/util';
import { AppConfigService } from 'src/app_config.service';
import { InfluxdbClientService } from '../device_data/influxdb_client.service';
import { UserWithPermission } from '../user/user_with_permission.entity';
import { DeviceService } from '../device/device.service';
import { start } from 'repl';

var moment = require('moment-timezone');
require('moment/locale/zh-tw');

const {InfluxDB, Point} = require('@influxdata/influxdb-client')

var cron = require('node-cron');

type PowerCron = {
  start_time: number,
  stop_time: number,
  weeks:string,
  power:number
};

var cron_tasks = []

@Injectable()
export class PowerSchedulerExService extends PowerSchedulerService {
  constructor(
    //@InjectRepository(PowerScheduler) public readonly powerSchedulerRepository: Repository<PowerScheduler>,
    @InjectRepository(PowerScheduler) public readonly powerSchedulerRepository: Repository<PowerScheduler>,
    public readonly appService: AppService,
    public readonly powerSchedulerService: PowerSchedulerService,
    public readonly domainServiceEx: DomainService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceService: DeviceService,
    public readonly deviceExService: DeviceService,
    public readonly deviceDataService: DeviceDataService,
  ) {
    super(powerSchedulerRepository)
  }

  async onModuleInit() {
    //this.dispatch();
    var system_user:UserWithPermission = AppConfigService.getSystemUser()
    this.updateCronTasks(system_user)
  }

  /*
  async dispatch_old(this_user:UserWithPermission) {
    try {
      var power_schedulers = await this.powerSchedulerService.findAll(this_user)
      var device_types = await this.deviceTypeService.findAll(this_user, {where:{device_type_name:'pomcube'}})
      if (device_types.length==0) {
        return;
      }
      var device_type_id = device_types[0].device_type_id
      for (var power_scheduler of power_schedulers) {
        try {
          if (power_scheduler.enabled && power_scheduler.domain_id!=null) {
            var crons:Array<PowerCron> = JSON.parse(power_scheduler.crons)
            if (!Array.isArray(crons)) continue;

            var now = moment().tz('Asia/Taipei')
            var today_sec = now.hours() * 60 * 60 + now.minutes() * 60 + now.seconds()
            var cron = null
            for (var c of crons) {
              if (today_sec>=c.start_time && today_sec<c.stop_time) {
                cron = c
                break;
              }
            }

          //  var devices = await this.domainServiceExEx.getAllDevices(this.deviceService, power_scheduler.domain_id, {device_type_id:device_type_id}, 1000000)
            var organization_id = await this.domainServiceEx.getOrganizationId(power_scheduler.domain_id)
            var params = {
              organization_id: organization_id,
              device_output_name: 'pomcube_data',
              domain_id: power_scheduler.domain_id,
              timezone: 'Asia/Taipei',
              //group_function: 'sum',
              start: '-30d',
              //stop: '',
              fields: 'BatSoC,SolarPower,LoadPower,GridPower',
              time_function: 'last',
              group_by: 'DeviceName,_field',
              //pivot_columns: 'DeviceName'
              //pivot_columns: '_field',
              //debug:true
            }

            var rows = await this.deviceDataService.query(this_user, params)
            var device_datas = {}
            for (var row of rows) {
              if (!(row.DeviceName in device_datas)) {
                device_datas[row.DeviceName] = {}
              }
              device_datas[row.DeviceName][row._field] = row._value
            }
          }
        } catch (ex) {
          console.log(ex)
        }
      }
    } catch (ex) {
      console.log(ex)
    }
  }
  */
  
  async notify(this_user:UserWithPermission, notify_user_id, text) {
    try {
      await this.appService.notifyUser(
        this_user,
        {
          user_id:notify_user_id,
          mail: true,
          email: true,
          line_notify: true
        },
        'power_scheduler', text, null, null)
    } catch (ex) {
      console.log(ex);
    }
    
  }

  async writeInfluxdb(this_user:UserWithPermission, power_scheduler_id, domain_id, pstype, data, message='', sell_energy=null, purchase_energy=null) {
    var organization_id = await this.domainServiceEx.getOrganizationId(domain_id)
    var organization = await this.domainServiceEx.findOne(this_user, organization_id)
    var org = AppConfigService.getInfluxdbConfig().org;
    var power_scheduler_measurement = AppConfigService.getSystemConfig().power_scheduler_measurement;
    var influxdb_client = InfluxdbClientService.getClient();
    let writeClient = influxdb_client.getWriteApi(org, organization.domain_name, 'ms')
    let point = new Point(power_scheduler_measurement)
    point.tag('power_scheduler_id', power_scheduler_id)
    point.tag('type', pstype)
    point.stringField('data', ''+data)
    point.stringField('message', ''+message)
    if (sell_energy!=null) {
      point.floatField('sell_energy', sell_energy)
    }
    if (purchase_energy!=null) {
      point.floatField('purchase_energy', purchase_energy)
    }
    writeClient.writePoint(point)
    await writeClient.flush();
  }

  clearCronTask() {
    var power_scheduler_ids = cron_tasks.map((cron_task)=>cron_task.power_scheduler_id)
    var power_scheduler_ids_set = new Set(power_scheduler_ids)
    var power_scheduler_ids_array = Array.from(power_scheduler_ids_set)
    if (power_scheduler_ids_array.length>0) {
      console.log('Cancel power_scheduler: ' + JSON.stringify(power_scheduler_ids_array,null,4))
    }

    var size = cron_tasks.length
    for (var n=size-1; n>=0; n--) {
      var cron_task = cron_tasks[n]
      cron_task.task.stop();
      cron_tasks.pop()
    }
  }


  async dispatch(this_user:UserWithPermission, cron_task) {
    var self = this
    var device_types = await self.deviceTypeService.findAll(this_user, {where:{device_type_name:'pomcube'}})
    if (device_types.length==0) {
      return
    }
    var device_type_id = device_types[0].device_type_id

    var power_scheduler = await self.powerSchedulerService.findOne(this_user, cron_task.power_scheduler_id)
    if (power_scheduler==null) throw new HttpException('power_scheduler not found', HttpStatus.NOT_FOUND);
    if (power_scheduler.domain_id!=null && power_scheduler.enabled) {
      var devices = await self.domainServiceEx.getAllDevices(this_user, self.deviceService, power_scheduler.domain_id, {device_type_id:device_type_id}, 1000000)
      if (devices.length==0) return;
      var power = null
      if (cron_task.power!=null) {
        power = Math.floor(cron_task.power / devices.length)
        if (isNaN(power)) {
          throw new HttpException('power is invalid', HttpStatus.BAD_REQUEST)
        }
      }
      var has_error = false
      var err_text = ''
      for (var device of devices) {
        try {
          let data = JSON.stringify({
            timezone: cron_task.timezone,
            continuity: cron_task.continuity,
            start_sec: cron_task.start_sec,
            stop_sec: cron_task.stop_sec,
            power: power
          })
          await self.deviceExService.sendDataToDevice(this_user, device.device_id, 'pomcube_bat_power', data)
          await Util.sleep(1000)
        } catch (ex) {
          has_error = true
          err_text += ((ex.message!=null)?ex.message:''+ex) + '\n';
          //console.log(ex)
        }
      }
      if (has_error) {
        throw new HttpException(err_text, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return
    }
    return
  }

  async getPomcubeData(this_user:UserWithPermission, domain_id) {
    var self = this
    if (domain_id==null) return [];
    var organization_id = await self.domainServiceEx.getOrganizationId(domain_id)
    var params = {
      organization_id: organization_id,
      device_output_name: 'pomcube_data',
      domain_id: domain_id,
      timezone: 'Asia/Taipei',
      //group_function: 'sum',
      start: '-30d',
      //stop: '',
      fields: 'BatSoC,SolarPower,GridPower',
      time_function: 'last',
      group_by: 'DeviceName,_field',
      //pivot_columns: 'DeviceName'
      //pivot_columns: '_field',
      //debug:true
    }

    var rows = await self.deviceDataService.query(this_user, params)
    var device_datas = {}
    for (var row of rows) {
      if (!(row.DeviceName in device_datas)) {
        device_datas[row.DeviceName] = {}
      }
      device_datas[row.DeviceName][row._field] = row._value
    }
    return device_datas
  }


  async startCronTask(this_user:UserWithPermission, cron_task, start_power) {
    var self = this

    async function getEnergy(domain_id, start_time, stop_time) {
      var sell_energy = null
      var purchase_energy = null
      if (start_time!=null && stop_time!=null) {
        var organization_id = await self.domainServiceEx.getOrganizationId(domain_id)
        //var organization = await self.domainService.findOne(organization_id)
        if (start_time!=null && stop_time!=null) {
          let energys = await self.deviceDataService.query(this_user, {
            "organization_id": organization_id,
            "device_output_name": 'pomcube_data',
            "device_type_name": "pomcube",
            "domain_id": domain_id,
            "start": start_time,
            "stop": stop_time,
            "fields": 'GridSellEnergy,GridPurchaseEnergy',
            "differenceNonNegativeSource": true,
            "group_by": "!DeviceName,_field",
            "timezone": 'Asia/Taipei',
            "time_function": "sum",
            "group_function": "sum",
            "pivot_columns": "_field"
          })
          if (energys.length>0) {
            sell_energy = energys[0].GridSellEnergy
            purchase_energy = energys[0].GridPurchaseEnergy
          }
        }
      }
      return {
        sell_energy,
        purchase_energy
      }
    }

    /*
    if (cron_task.executed) {
      console.log('cron_task is executed.', cron_task)
      return
    }
    */
    cron_task.executed = true

    console.log((new Date()).toDateString() + ' - PowerSchedulerExService start a cron_task.');

    var system_user:UserWithPermission = AppConfigService.getSystemUser()

    try {
      var power_scheduler = await self.powerSchedulerService.findOne(system_user, cron_task.power_scheduler_id)
      if (power_scheduler==null) return;
    } catch (ex) {
      console.log(ex)
      return
    }


    var sell_energy = null
    var purchase_energy = null
    var prev_start_sec = cron_task.prev_start_sec
    var fire_sec = cron_task.seconds
    if (prev_start_sec!=null && fire_sec!=null) {
      try {
        var m = moment.tz(new Date(), cron_task.timezone)
        m.startOf('day')
        let prev_start_time = m.clone().add(prev_start_sec, 'seconds').toISOString()
        let fire_time = m.clone().add(fire_sec, 'seconds').toISOString()
        var e = await getEnergy(power_scheduler.domain_id, prev_start_time, fire_time)
        sell_energy = e.sell_energy
        purchase_energy = e.purchase_energy
      } catch (ex) {
        console.log(ex)
      }
    }

    try {

      var ex_dispatch = null
      try {
        await this.dispatch(system_user, cron_task)
      } catch (ex) {
        ex_dispatch = (ex.message!=null)?ex.message:''+ex;
        console.log(ex)
      }

      try {
        var text = '';
        var pstype = ''
        //influx_data = `{"charge_power":${cron_task.power}}`
        var influx_data = {"charge_power":start_power}
        if (cron_task.start_stop=='start') {
          pstype = 'start'
          let text_dc = ''
          if (cron_task.power>0) {
            text_dc = '充電'
          } else {
            text_dc = '放電'
          }
          let power = Math.abs(cron_task.power)
          //text = `電池排程已啟動, 預定放電功率 ${-cron_task.power} w`
          text = `電池排程已啟動, 預定${text_dc}功率 ${power} w`
          if (ex_dispatch!=null) text += '\n' + ex_dispatch;
          try {
            await self.update(system_user, power_scheduler.power_scheduler_id, {
              "running": true
            });
          } catch (ex) {
            console.log(ex)
          }
        } else {
          pstype = 'stop'
          text = `電池排程已停止`
          if (ex_dispatch!=null) text += '\n' + ex_dispatch;
          try {
            await self.update(system_user, power_scheduler.power_scheduler_id, {
              "running": false
            });
          } catch (ex) {
            console.log(ex)
          }
        }

        if (ex_dispatch!=null) {
          influx_data["error"] = ex_dispatch
        }
        try {
          await self.writeInfluxdb(system_user, power_scheduler.power_scheduler_id, power_scheduler.domain_id, pstype, JSON.stringify(influx_data), text, sell_energy, purchase_energy)
        } catch (ex) {
          console.log(ex)
        }
        await self.notify(this_user, cron_task.notify_user_id, text)
      } catch (ex) {
        console.log(ex)
      }

      await Util.sleep(240000)
      //await Util.sleep(60000)

      /*
      // GridPower: {正:充電, 負:放電}
      power_scheduler.info = {
        "start": {
          "time": "2024-11-17T02:00:00.000Z",
          "error": "device offline",
          "devices": [
            {
              "DeviceName": "ESS01",
              "SoC": 100,
              "SolarPower": 996,
              "GridPower": -700
            }
          ]
        },
        "stop": {
          "time": "2024-11-17T04:00:00.000Z",
          "error": null,
          "devices": [
            {
              "DeviceName": "ESS01",
              "SoC": 100,
              "SolarPower": 996,
              "GridPower": -700
            }
          ]
        }
      }
      */

      var device_datas = {}
      try {
        device_datas = await self.getPomcubeData(this_user, power_scheduler.domain_id)
        var device_infos = []
        var text = '目前裝置狀態\n'
        for (var device_data_name in device_datas) {
          var device_data = device_datas[device_data_name]
          text += device_data_name + '\n'
          text += '  SoC : ' + device_data.BatSoC + ' %\n'
          text += '  SolarPower : ' + device_data.SolarPower + ' w\n'
          text += '  GridPower : ' + device_data.GridPower + ' w\n'
          device_infos.push({
            "DeviceName": device_data_name,
            "SoC": device_data.BatSoC,
            "SolarPower": device_data.SolarPower,
            "GridPower": device_data.GridPower
          })
        }

        var info:any = {}
        var start_time = null
        var stop_time = null

        if (cron_task.start_stop=='start') {
          start_time = (new Date()).toISOString()
          info = {
            "start": {
              "time": start_time,
              "error": ex_dispatch,
              "devices": device_infos
            }
          }
        } else if (cron_task.start_stop=='stop') {
          info = {}
          try {
            info = JSON.parse(power_scheduler.info)
            let time = power_scheduler.start_time
            if (time!=null) {
              start_time = (new Date(time)).toISOString()
            }
          } catch (ex) {
            console.log(ex)
          }
          stop_time = (new Date()).toISOString()
          info.stop = {
            "time": stop_time,
            "error": ex_dispatch,
            "devices": device_infos
          }
        }

        info.sell_energy = sell_energy
        info.purchase_energy = purchase_energy

        /*
        var update_count = power_scheduler.update_count
        var discharge_energy = power_scheduler.discharge_energy
        if (cron_task.start_stop=='stop') {
          update_count ++
          if (sell_energy!=null) discharge_energy += sell_energy
        }
        */
        
        try {
          var new_data:any = {
            "info": JSON.stringify(info)
          }
          if (cron_task.start_stop=='start') new_data.start_time = start_time;
          if (cron_task.start_stop=='stop') new_data.stop_time = stop_time;
          await self.update(system_user, power_scheduler.power_scheduler_id, new_data);
        } catch (ex) {
          console.log(ex)
        }

        try {
          var pstype:string = (cron_task.start_stop=='start')?'start_stable':'stop_stable';
          if (Object.keys(device_datas).length>0) {
            await self.writeInfluxdb(system_user, power_scheduler.power_scheduler_id, power_scheduler.domain_id, pstype, JSON.stringify(device_datas), text, sell_energy, purchase_energy)
          }
        } catch (ex) {
          console.log(ex)
        }

        await self.notify(this_user, cron_task.notify_user_id, text)
      } catch (ex) {
        console.log(ex)
      }
    } catch (ex) {
      console.log(ex)
    }
  }
  
  async startNowCronTask(this_user:UserWithPermission) {
    var now = moment();
    for (var cron_task of cron_tasks) {
      if (cron_task.start_stop!='start') continue;
      now.tz(cron_task.timezone)
      var start_of_day = now.clone().startOf('day'); // 今天 00:00:00
      var secondsPassed = now.diff(start_of_day, 'seconds');
      if (cron_task.start_sec<=secondsPassed && secondsPassed<cron_task.stop_sec) {
        await this.startCronTask(this_user, cron_task, cron_task.start_power)
      }
    }
  }

  
  isCronTaskRunning() {
    var now = moment();
    var running = false
    for (var cron_task of cron_tasks) {
      if (cron_task.start_stop!='start') continue;
      now.tz(cron_task.timezone)
      var start_of_day = now.clone().startOf('day'); // 今天 00:00:00
      var secondsPassed = now.diff(start_of_day, 'seconds');
      if (cron_task.start_sec<=secondsPassed && secondsPassed<cron_task.stop_sec) {
        running = true
        break
      }
    }
    return running
  }

  async updateCronTasks(this_user:UserWithPermission) {
    var self = this

    var test_mode = AppConfigService.getSystemConfig().test_mode
  //  if (test_mode) return;

    function addCronTask(power_scheduler_id, start_stop, continuity, timezone, prev_start_sec, start_sec, stop_sec, fire_sec, power, start_power, notify_user_id) {

      function CTask(cron_task) {
        var seconds = cron_task.seconds
        const hours = Math.floor(seconds / 3600) % 24;
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        var cron_text = `${secs} ${minutes} ${hours} * * *`
        var task = cron.schedule(cron_text, async() => {
          //console.log((new Date()).toDateString() + ' - PowerSchedulerExService start a cron_task.');

          var system_user:UserWithPermission = AppConfigService.getSystemUser()
          //if (cron_task.start_stop=='start') {
          //  await this.startNowCronTask(system_user)
          //} else if (cron_task.start_stop=='stop') {
            await self.startCronTask(system_user, cron_task, start_power)
          //}
        }, {
          scheduled: true,
          timezone: cron_task.timezone
        });
        cron_task.task = task
      }

      var cron_task = {
        executed: false,
        power_scheduler_id,
        start_stop,
        timezone,
        continuity,
        prev_start_sec,
        start_sec,
        stop_sec,
        seconds: fire_sec,
        start_power,
        power,
        notify_user_id,
        task: null
      }

      new CTask(cron_task)
      cron_tasks.push(cron_task)
    }

    try {
      this.clearCronTask()
      var power_schedulers = await this.powerSchedulerService.findAll(this_user)

      
      //console.log(JSON.stringify(power_schedulers,null,4))
      /*
      power_schedulers = [
        {
            "power_scheduler_id": 4,
            "domain_id": 187,
            "device_id": null,
            "timezone": "Asia/Taipei",
            "crons": "[{\"start_time\":53880, \"stop_time\":54280, \"power\":-30000}, {\"start_time\":3600, \"stop_time\":10800, \"power\":10000}]",
            "notify_user_id": 1,
            "update_time": "2024-12-05T23:54:31.212Z",
            "start_time": null,
            "stop_time": null,
            "running": false,
            "info": "",
            "enabled": true
        }
      ]
      */
      


      /*
      var device_types = await this.deviceTypeService.findAll({where:{device_type_name:'pomcube'}})
      if (device_types.length==0) {
        return;
      }
      var device_type_id = device_types[0].device_type_id
      */
      for (var power_scheduler of power_schedulers) {
        try {
          if (power_scheduler.enabled && power_scheduler.domain_id!=null) {

            console.log(JSON.stringify(power_scheduler,null,4))

            var crons:Array<PowerCron> = JSON.parse(power_scheduler.crons)
            if (!Array.isArray(crons)) continue;

            crons.sort(function(a,b) {
              return a.start_time - b.start_time
            })

            var crons_size = crons.length
            for (var n=0; n<crons_size; n++) {
              var c = crons[n]
              if (c.start_time<c.stop_time) {
                var continuity = !(n==crons_size-1 || crons[n+1].start_time!=c.stop_time)

                var prev_start_sec = null
                if (n>0) {
                  if (crons[n-1].stop_time==c.start_time) {
                    prev_start_sec = crons[n-1].start_time
                  }
                }
                addCronTask(power_scheduler.power_scheduler_id, 'start', continuity, power_scheduler.timezone, prev_start_sec, c.start_time, c.stop_time, c.start_time, c.power, c.power, power_scheduler.notify_user_id)
                if (!continuity) {
                  prev_start_sec = c.start_time
                  addCronTask(power_scheduler.power_scheduler_id, 'stop', continuity, power_scheduler.timezone, prev_start_sec, c.start_time, c.stop_time, c.stop_time, null, c.power, power_scheduler.notify_user_id)
                }
              }
            }
          }
        } catch (ex) {
          console.log(ex)
        }
      }
    } catch (ex) {
      console.log(ex)
    }

    try {
      await this.startNowCronTask(this_user)
    } catch (ex) {
      console.log(ex)
    }

  }

  async queryHistory(power_scheduler:PowerScheduler) {
    var params = {
      organization_id: 182,
      device_output_name: 'power_scheduler',
      domain_id: 187,
      timezone: 'Asia/Taipei',
      //group_function: 'sum',
      start: '-30d',
      //stop: '',
      fields: 'data,message,purchase_energy,sell_energy',
      //pivot_columns: 'DeviceName'
      //pivot_columns: '_field',
      //debug:true
    }

    var start_time = moment().tz('Asia/Taipei')
    start_time.startOf('month')

    var flux = `
from(bucket: "工研院綠能所")
  |> range(start: ${start_time.toISOString()})
  |> filter(fn: (r) => r["_measurement"] == "power_scheduler")
  |> filter(fn: (r) => r["power_scheduler_id"] == "${power_scheduler.power_scheduler_id}")
  |> filter(fn: (r) => r["_field"] == "data" or r["_field"] == "message" or r["_field"] == "purchase_energy" or r["_field"] == "sell_energy")
  |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> group()
  |> sort(columns: ["_time"], desc: true)
  `

    var datas = await this.deviceDataService.queryByFlux(flux)
    //datas.sort(function(a,b){
    //  return a._time - b._time
    //})
    return datas

    //  |> filter(fn: (r) => r["_field"] == "data" or r["_field"] == "message" or r["_field"] == "purchase_energy" or r["_field"] == "sell_energy")
  }

}

/*
async function xxx() {
  function x(v) {
    setTimeout(function() {
      console.log('========================>>>>>>> ' + v)
    }, Math.floor(Math.random()*10000))
  }

  for (var n=0; n<10; n++) {
    new x(n)
  }
}
xxx()
*/
