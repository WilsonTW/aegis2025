
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOperator } from 'typeorm';
import { Device, DeviceUpdate } from './device.entity';
import { DeviceServiceBase } from './device.service.base';
import { Util } from 'src/util/util';
import { DeviceSpecStorer } from '../device_data/device_spec_storer.service';
import { Domain } from '../domain/domain.entity';
import { DomainService } from '../domain/domain.service';
import { DeviceTypeService } from '../device_type/device_type.service';
import { DeviceInputService } from '../device_input/device_input.service';
import { AppConfigService } from 'src/app_config.service';
import { UserWithPermission } from '../user/user_with_permission.entity';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { GetDeviceArgs } from './device.args';

var moment = require('moment-timezone');
require('moment/locale/zh-tw');


var cache_devices:Array<Device> = null;


var pomcube:Pomcube = null;

class Pomcube {

  api_host?:string;
  username?:string;
  password?:string;

  api_token?:string;
  last_login_time:number = 0;
  devices:Array<any> = [];

  constructor(api_host, username, password) {
    this.api_host = api_host
    this.username = username
    this.password = password
  }

  async login(username, password) {
    try {
      var details = {
        username: username,
        password: password
      };
      
      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      var body = formBody.join("&");
      
      const response = await fetch(this.api_host + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: body
      })

      if (response.status>=400) {
          var text = await response.text();
          console.log('Cannot login pomcube". response('+response.status+')="'+text+'"');
          throw new HttpException(text, response.status)
      } else {
        var json = await response.json();
        if (json.access_token!=null) {
          this.api_token = json.access_token
          this.last_login_time = Date.now();
          return;
        }
      }
    } catch (error) {
      console.log('Cannot login pomcube.');
      console.log(error);
      throw error
    }
  }

  async relogin() {
    if (Date.now()-this.last_login_time>30*60*1000) {
      await this.login(this.username, this.password)
    }
  }

  /*
  [
    {
      "id": 17,
      "device_id": 2332,
      "device_model": "PNZ-UN0",
      "device_code": "01235460ED9F7CE0EE",
      "device_sn": "AA-70-2201-01-0093-915",
      "device_name": "台南鼎硯 915"
    }
  ]
  */
  async getDeviceList() {
    try {
      await this.relogin()

      var response = await fetch(this.api_host + '/nzpu/user_devices', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + this.api_token
        }
      })
      if (response.status>=400) {
        var text = await response.text();
        console.log('Cannot get pomcube device list". response('+response.status+')="'+text+'"');
        return
      }
      this.devices = await response.json()
      return this.devices
    } catch (ex) {console.log(ex)}
    return null
  }

  async getDeviceBySN(device_sn) {
    var device = this.devices.find(x=>x.device_sn==device_sn)
    if (device!=null) {
      return device
    }
    await this.getDeviceList()
    return this.devices.find(x=>x.device_sn==device_sn)
  }

  async setPower(device_id, power?:number, start_sec:number=null, stop_sec:number=null) {

    if (power==null) {
      await this.removeTimer(device_id)
      return;
    }

    await this.relogin()
    var timer_id = await this.removeTimer(device_id, true)

    if (isNaN(power)) {
      throw new HttpException('Set pomcube power. power is invalid', HttpStatus.BAD_REQUEST);
    }

    if (power<-12500) power=-12500;
    if (power>12500) power=12500;
    console.log(`set device[${device_id}].power =  ${power}`);

    /*
    var m = moment();
    var now = m.startOf('day').unix();
    //var now = Math.floor(Date.now()/1000);
    var endTime = m.add(2,'year').startOf('day').unix();

    var timer_args = {
      "NS_deviceId": device_id,
      "NS_endTime": endTime,
      "NS_power": power,
      "NS_startTime": now,
      "NS_time": now,
      "NS_valid": 1,
      "NS_repeat": "0,1,2,3,4,5,6"
    }
    */

    var timer_args = {
      "NS_deviceId": device_id,
      "NS_endTime": stop_sec,
      "NS_power": power,
      "NS_startTime": start_sec,
      "NS_time": start_sec,
      "NS_valid": 1,
      "NS_repeat": "0,1,2,3,4,5,6"
    }
    console.log('setPower timer_args: ', JSON.stringify(timer_args))

    if (timer_id==null) {
      await this.createNewTimer(timer_args)
    } else {
      await this.updateTimer(timer_id, timer_args)
    }
  }



  
  async createNewTimer(timer_args) {
    //var status = null
    //var response_text = ''
    var success = false
    for (var n=0; n<5; n++) {
      var response = await fetch(this.api_host + '/api/v2/timer', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + this.api_token
        },
        body: JSON.stringify(timer_args)
      })
      let status = response.status
      let response_text = ''
      if (response.status>=400) {
        response_text = await response.text();
        console.log('createNewTimer error: ' + response_text)
        await Util.sleep(2000)
        continue;
      } else {
        /*
        {
          "requestId": "11a88d51-c398-47b5-9caf-a51cd0bebf01",
          "code": 200,
          "msg": "success",
          "data": {
            "timerId": 1729762329
          }
        }
        */
        var response_json = await response.json();
        var timerId = response_json?.data?.timerId;
        if (timerId==null) {
          await Util.sleep(2000)
          continue;
        }

        await Util.sleep(5000)

        var response_timer = await this.getTimer(timer_args.NS_deviceId)
        if (response_timer?.NS_data==null || !(timerId in response_timer.NS_data)) {
          await Util.sleep(2000)
          continue;
        }

        success = true
        break;
      }
    }

    if (!success) {
      var device_sn = null
      var device = this.devices.find(x=>x.device_id==timer_args.NS_deviceId)
      if (device!=null) device_sn = device.device_sn;
      throw new HttpException('Cannot create pomcube('+device_sn+') schedule timer.', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /*
    if (response_data!=null) {
      try {
        var json = JSON.parse(response_data);
        var timerId = json?.data?.timerId;
        if (timerId!=null) schedule_timer = {
          device_id: device_id,
          timer_id: timerId
        };
      } catch (ex) {
        self.log(ex);
      }
    }
    */
  }

  async updateTimer(timerId, timer_args) {
    for (var n=0; n<2; n++) {
      try {
        var response = await fetch(this.api_host + '/api/v2/timer/' + encodeURIComponent(timerId), {
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + this.api_token
          },
          body: JSON.stringify(timer_args)
        })
        if (response.status>=400) {
          var text = await response.text();
          console.log('Cannot update pomcube timer". response('+response.status+')="'+text+'"');
          await Util.sleep(2000)
          continue;
        } else {
          await Util.sleep(2000)
          break;
        }
      } catch (ex) {console.log(ex)}
    }
  }

  async getTimer(device_id) {
    /*
    {
      "NS_requestId": "df97d227-c96f-4ca1-aeb3-25c113fe9092",
      "NS_code": 200,
      "NS_msg": "success",
      "NS_data": {
        "1719192795": {
          "NS_EndTime": 1724956200,
          "NS_Power": 5000,
          "NS_StartTime": 1724947215,
          "NS_Time": 1719192795,
          "NS_Valid": 1,
          "NS_Repeat": "1,2,3,4,5,6,"
        }
      }
    }
    */
    var response = await fetch(this.api_host + `/api/v2/timer?deviceId=${encodeURIComponent(device_id)}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.api_token
      }
    })
    if (response.status>=400) {
      var text = await response.text();
      console.log('Cannot get pomcube timer". response('+response.status+')="'+text+'"');
      throw new HttpException(text, response.status);
    }
    return await response.json();
  }


  async removeTimer(device_id, retain=false) {

    var ret = null

    var success = false
    for (var n=0; n<5; n++) {
      var response_data = await this.getTimer(device_id)
      //console.log(response_data);

      if (response_data?.NS_data==null) {
        await Util.sleep(2000)
        continue;
      }

      var size = Object.keys(response_data.NS_data).length
      if (size==0) {
        success = true
        break;
      }

      var n = 0
      for (var timer_id in response_data.NS_data) {
        //var timer = response_data.NS_data[timer_id]
        ret = timer_id
        if (retain && n==size-1) {
          success = true
          break;
        }
        var status = null
        var response_text = ''
        var response = await fetch(this.api_host + `/api/v2/timer/${timer_id}?deviceId=${encodeURIComponent(device_id)}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + this.api_token
          }
        })
        if (response.status>=400) {
          status = response.status
          response_text = await response.text()
          console.log('Cannot delete pomcube schedule timer". response('+status+')="'+response_text+'"');
        } else {
          console.log('Pomcube timer is removed: device_id='+device_id+', timer_id=' + timer_id)
        }
        await Util.sleep(1000)
        n ++
      }
      if (success) break;
    }

    if (!success) {
      var device_sn = null
      var device = this.devices.find(x=>x.device_id==device_id)
      if (device!=null) device_sn = device.device_sn;
      throw new HttpException('Cannot delete pomcube('+device_sn+') schedule timer.', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return ret

  }
}


pomcube = new Pomcube(
  AppConfigService.getSystemConfig().pomcube_api_host,
  AppConfigService.getSystemConfig().pomcube_username,
  AppConfigService.getSystemConfig().pomcube_password
)



@Injectable()
//export class DeviceService extends OmitType(DeviceServiceBase,  ['create', 'findAll', 'findOne', 'update', 'remove']) {
export class DeviceService22 extends DeviceServiceBase {
  constructor(
    @InjectRepository(Device) public readonly deviceRepository: Repository<Device>,
  ) {
    super(deviceRepository);
  }

}

@Injectable()
export class DeviceService extends DeviceServiceBase {
  constructor(
    @InjectRepository(Device) public readonly deviceRepository: Repository<Device>,
    public readonly domainService: DomainService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceInputService: DeviceInputService,
  ) {
    super(deviceRepository);
  }


  async storeDeviceSpec(this_user:UserWithPermission, device) {
    await DeviceSpecStorer.storeDeviceSpec(this_user, [device], null, null, device?.domain_id, this.domainService)
  }

  async fixDeviceTypeCategoryId(this_user:UserWithPermission, device: DeviceUpdate) {
    if ('device_type_category_id' in device) {
      delete device.device_type_category_id
    }
    if ('device_type_id' in device) {
      if (device.device_type_id==null) {
        device.device_type_category_id = null
      } else {
        var device_type = await this.deviceTypeService.findOne(this_user, device.device_type_id)
        if (device_type==null) {
          throw new HttpException('DeviceType not found', HttpStatus.NOT_FOUND);
        }
        device.device_type_category_id = device_type.device_type_category_id;
      }
    }
  }


  async checkData(this_user:UserWithPermission, device: DeviceUpdate, device_id=null) {
    if (device_id!=null) {
      var device2:Device = await this.findOneInDomain(this_user, device_id)
      if (device2==null) {
        throw new HttpException('The device is not in this domain', HttpStatus.FORBIDDEN);
      }
    }

    if (device?.domain_id!=null) {
      var in_domain = await this.domainService.includeDomain(this_user.domain_id, device.domain_id)
      if (!in_domain) {
        throw new HttpException('domain_id is out of domain', HttpStatus.FORBIDDEN);
      }
    }

    if (device?.device_name!=null) {
      if ((''+device.device_name).trim()=='') {
        throw new HttpException('device_name is null', HttpStatus.BAD_REQUEST);
      }
      var organization_id = await this.domainService.getOrganizationId(device.domain_id)
      var devices = await this.domainService.getAllDevices(this_user, this, organization_id,{device_name:device.device_name}, 1000000)
      if (devices.length>0) {
        throw new HttpException('device_name is exist', HttpStatus.CONFLICT);
      }
    }
    if (device!=null) {
      await this.fixDeviceTypeCategoryId(this_user, device)
    }
  }

  async create(this_user:UserWithPermission, device: DeviceUpdate): Promise<Device> {
    if (device.domain_id==null) {
      throw new HttpException('domain_id is null', HttpStatus.BAD_REQUEST);
    }
    if (device.device_name==null || (''+device.device_name).trim()=='') {
      throw new HttpException('device_name is null', HttpStatus.BAD_REQUEST);
    }
    await this.checkData(this_user, device)
    var ret = await this.deviceRepository.save(device);
    cache_devices =  await this.deviceRepository.find();
    await this.storeDeviceSpec(this_user, device)
    Util.notifyDeviceChanged()
    return ret;
  }

  async update(this_user:UserWithPermission, id: number, updateDevice: DeviceUpdate): Promise<Device> {
    await this.checkData(this_user, updateDevice, id)
    await this.deviceRepository.update(id, updateDevice);
    var device = await this.deviceRepository.findOne({where:{device_id:id}});
    if (cache_devices==null) {
      cache_devices = await this.deviceRepository.find();
      await this.storeDeviceSpec(this_user, {domain_id:device.domain_id, ...updateDevice})
      return device;
    }
    if (device!=null) {
      var index = cache_devices.findIndex(x=>x.device_id==id);
      if (index!=-1) {
        cache_devices[index] = device;
      }
    }
    var device2 = {
      domain_id: device.domain_id,
      device_name: device.device_name,
      place_name: (device.place_name=='') ? null : device.place_name,
      ...updateDevice
    }
    await this.storeDeviceSpec(this_user, device2)
    if (  "device_name" in updateDevice
       || "device_type_id" in updateDevice
       || "device_connection_id" in updateDevice
       || "domain_id" in updateDevice
       || "enabled" in updateDevice
      ) {
      Util.notifyDeviceChanged()
    }
    return device;
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    await this.checkData(this_user, null, id)
    const result = await this.deviceRepository.delete(id);
    cache_devices =  await this.deviceRepository.find();
    Util.notifyDeviceChanged()
    return result.affected > 0;
  }


  async findAll(this_user:UserWithPermission, options=null): Promise<Device[]> {
    try {
      var ret:Array<Device>;
      if (cache_devices==null) {
        ret = await this.deviceRepository.find();
        cache_devices = ret;
      } else {
        ret = cache_devices;
      }

      var where = options?.where;
      if (where!=null) {
        for (var n in where) {
          var cond = where[n];
          if (cond instanceof FindOperator) {
            if (cond.type=='in' && Array.isArray(cond.value)) {
              ret = ret.filter(x=>cond.value.includes(x[n]))
            }
          } else {
            ret = ret.filter(x=>x[n]==cond)
          }
        }
      }
      return ret;
    } catch(ex) {
      console.log(ex);
    }
    return [];
    // return await this.deviceRepository.find(options);
  }

  async findAllInDomain(this_user:UserWithPermission, options=null): Promise<Device[]> {
    var devices = await this.domainService.getAllDevices(this_user, this, this_user.domain_id, options?.where)
    return devices
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<Device> {
    var devices = await this.findAll(this_user, {where:{device_id:id}});
    return (devices.length>0)?devices[0]:null;
    // return await this.deviceRepository.findOne({
    //     where: {
    //       device_id:id,
    //     },
    // });
  }

  async findOneInDomain(this_user:UserWithPermission, id: number): Promise<Device> {
    var where:GetDeviceArgs = {device_id: id}
    var devices = await this.domainService.getAllDevices(this_user, this, this_user.domain_id, where)
    return devices.length>0 ? devices[0] : null;
  }

  async sendDataToDevice(this_user:UserWithPermission, device_id, device_input_name, data) {
    if (data==null) data = '';
    if (data=='null') data = '';
    if (device_input_name=='pomcube_bat_power') {
      var data2 = JSON.parse(data)
      var device = await this.findOne(this_user, device_id)
      if (device==null) {
        throw new HttpException('Device not found', HttpStatus.NOT_FOUND)
      }
      var device_sn = device.device_name;
      var pomcube_device = await pomcube.getDeviceBySN(device_sn)
      if (pomcube_device!=null) {
        var m = moment.tz(new Date(), data2.timezone)
        m.startOf('day')
        var m2 = m.clone();
        let start_sec = m.add(data2.start_sec, 'seconds').unix()
        if (data2.continuity) {
          m2.add(5, 'minutes')
        }
        let stop_sec = m2.add(data2.stop_sec, 'seconds').unix()
        await pomcube.setPower(pomcube_device.device_id, data2.power, start_sec, stop_sec)
      }
    }
  }


}  