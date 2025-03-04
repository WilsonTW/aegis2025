import { HttpException, HttpStatus, Injectable, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InfluxdbClientService } from "./influxdb_client.service";
import { DomainService } from "../domain/domain.service";
import { DeviceService } from "../device/device.service";
import { Util } from "src/util/util";
import { AppConfigService } from "src/app_config.service";
import { UserWithPermission } from "../user/user_with_permission.entity";

var moment = require('moment-timezone');
require('moment/locale/zh-tw');

const {InfluxDB, Point} = require('@influxdata/influxdb-client')
const {DeleteAPI} = require('@influxdata/influxdb-client-apis')

export class DeviceSpecStorer {

  public static async storeDeviceSpec(this_user:UserWithPermission, devices, time=null, bucket=null, domain_id=null, domainService:DomainService=null) {

    var fields = {
      bat_capacity: 'BatCapacity',
      solar_area: 'SolarArea',
      solar_eff: 'SolarEff',
      solar_capacity: 'SolarCapacity'
    }

    var all_has_data = false
    for (var device of devices) {
      for (var field_name in fields) {
        if (device[field_name]!=null) {
          all_has_data = true
          break
        }
      }
      if (all_has_data) break;
    }
    if (!all_has_data) return;

    if (bucket==null) {
      if (domain_id==null || domainService==null) return;
      var org_id = await domainService.getOrganizationId(domain_id)
      bucket = (await domainService.findOne(this_user, org_id))?.domain_name
      if (bucket==null) return;
    }

    var org = AppConfigService.getInfluxdbConfig().org;
    var measurement = 'device_spec'

    if (time==null) {
      var m = moment()
      m.millisecond(0)
      m.second(0)
      m.minute(0)
      time = m.toISOString()
    }

    var influxdb_client = InfluxdbClientService.getClient();
    let writeClient = influxdb_client.getWriteApi(org, bucket, 'ms')
    for (var device of devices) {
      var has_data = false
      let point = new Point(measurement)
      point.tag('DeviceName', device.device_name)
      if (device.place_name!=null && (''+device.place_name).trim()!='') point.tag('PlaceName', device.place_name)
      for (var field_name in fields) {
        if (device[field_name]!=null) {
          point.floatField(fields[field_name], device[field_name])
          has_data = true
        }
      }
      point.timestamp(new Date(time))
      if (has_data) {
        writeClient.writePoint(point)
      }
    }
    if (all_has_data) {
      await writeClient.flush();
    }
  }

  public static async updateInfluxdbDeviceSpec(this_user:UserWithPermission, domainServiceEx:DomainService, deviceService, time=null) {

    async function storeDeviceSpec(domains, time) {

      for (var domain of domains) {
        if (domain.domain_id==2) continue; // recycle
        try {
          var devices = await domainServiceEx.getAllDevices(this_user, deviceService, domain.domain_id, {}, 1000000)
          await DeviceSpecStorer.storeDeviceSpec(this_user, devices, time, domain.domain_name)
        } catch (ex) {
          console.log(ex)
        }
      }

    }

    var domains = await domainServiceEx.findAll(this_user, {
      where:{
        parent_domain_id: 1
      }
    })

    if (time==null) {
      var m = moment()
      m.minute(0)
      m.second(0)
      m.millisecond(0)
      time = m.toISOString()
    }
    await storeDeviceSpec(domains, time)

    /*
    m.year(2024)
    m.month(6)
    m.date(1)
    m.hour(0)
    var now = Date.now()
    while (m.unix()*1000<now) {
      var time = m.toISOString()
      await storeDeviceSpec(domains, time)
      m.add(1, 'h')
    }
    var xxx = 123;
    */

    
  }

}

