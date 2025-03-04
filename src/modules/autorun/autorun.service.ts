import { HttpException, HttpStatus, Injectable, OnModuleInit } from "@nestjs/common";
import { Cron, Timeout } from "@nestjs/schedule";
import { DeviceService } from "../device/device.service";
import { Util } from "src/util/util";
import { AppConfigService } from "src/app_config.service";
import { DeviceSpecStorer } from "../device_data/device_spec_storer.service";
import { DataStorerManager } from "../data_storer/mqtt.service";
import { DomainService } from "../domain/domain.service";

var moment = require('moment-timezone');
require('moment/locale/zh-tw');

const {InfluxDB, Point} = require('@influxdata/influxdb-client')
const {DeleteAPI} = require('@influxdata/influxdb-client-apis')

@Injectable()
export class AutoRunService implements OnModuleInit {

  constructor(
    //public readonly influxdbClientService:InfluxdbClientService,
    //public readonly deviceDataService: DeviceDataService,
    public readonly domainServiceEx: DomainService,
    public readonly deviceService: DeviceService
  ) {}

  
  onModuleInit() {
    this.executeCronJob();
  }

  //@Cron('0 * * * * *')  // every minute, on the 0th second
  //@Cron('0 0 */1 * * *')  // every 1 hours
  @Cron('0 */5 * * * *')  // every 5 min
  handleCron() {
    this.executeCronJob();
  }

  async executeCronJob() {

    var test_mode = AppConfigService.getSystemConfig().test_mode
    if (test_mode) return;

    console.log('>>> ' + (new Date()).toISOString()+' DeviceSpecStorerService - executeCronJob')

    var system_user = AppConfigService.getSystemUser()

    var m = moment()
    //m.minute(0)
    m.second(0)
    m.millisecond(0)
    var time = m.toISOString()

    try {
      await DeviceSpecStorer.updateInfluxdbDeviceSpec(system_user, this.domainServiceEx, this.deviceService, time)
    } catch(ex) {
      console.log(ex)
    }
  }


  @Timeout(5000)
  async start() {
    try {
      await DataStorerManager.updateAllConnection();
    } catch (ex) {
      console.log(ex)
    }
    this.offlineWatcher();
  }

  async offlineWatcher() {

    var test_mode = AppConfigService.getSystemConfig().test_mode
    if (test_mode) return;

    console.log('start offlineWatcher ...')
    var system_user = AppConfigService.getSystemUser()
    var timeout = AppConfigService.getSystemConfig().offline_timeout
    while (true) {
      try {
        //var devices = await this.deviceService.findAll({where:{enabled:true}})
        var devices = await this.deviceService.findAll(system_user)
        for (var device of devices) {
          var d:any = new Date(device.last_connect_time)
          if (isNaN(d) || (Date.now()-d.getTime()>timeout)) {
            if (!(device.is_online==false && device.device_state=='unknow')) {
              await this.deviceService.update(system_user, device.device_id, {
                "is_online": false,
                "device_state": 'unknow'
              })
            }
          }
        }
      } catch (ex) {
        console.log(ex)
      }
      await Util.sleep(timeout)
    }
  }

}
