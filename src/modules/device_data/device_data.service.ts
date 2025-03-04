import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Device } from '../device/device.entity';
import { DeviceConnection } from '../device_connection/device_connection.entity';
import { DeviceType } from '../device_type/device_type.entity';
import { Domain } from '../domain/domain.entity';
import { AppConfigService } from '../../app_config.service';
import { InfluxdbClientService } from './influxdb_client.service';
import { DomainService } from '../domain/domain.service';
import { DeviceOutputService } from '../device_output/device_output.service';
import { DeviceService } from '../device/device.service';
import { DataStorerManager } from '../data_storer/mqtt.service';
import { DeviceTypeService } from '../device_type/device_type.service';
import * as PDFDocument from 'pdfkit'
import { width } from 'pdfkit/js/page';
import { Util } from '../../util/util';
import { AppService } from 'src/app.service';
import { DarkBox } from 'src/util/darkbox';
import { EventService } from '../event/event.service';
import { DeviceDataPredictionService } from './device_data_prediction.service';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { DeviceTypeCategoryService } from '../device_type_category/device_type_category.service';
import { RecordConverter } from 'src/util/record_converter';
import { every } from 'rxjs';
import { UserWithPermission } from '../user/user_with_permission.entity';


var dsource = {
  "querys": [
    {
      "sources": [
        {
          "device_output_name": "solar_prediction",
          "device_names": "HERMES_SP000001",
          "fields": "DirectRadiation:PredictionIrradiance"
        }
      ],
      "group_function": "mean"
    },
    {
      "sources": [
        {
          "device_output_name": "solar_prediction",
          "device_names": "AA-70-2211-01-0078-938,AA-70-2211-01-0217-874,AA-70-2212-01-0028-070,HERMES_ESS000001,HERMES_ESS000002,HERMES_ESS000003,HERMES_PV000001,HERMES_PV000002",
          "fields": "SolarPower:PredictionSolarPower,SolarEff,SolarArea"
        }
      ],
      "group_function": "sum"
    },
    {
      "sources": [
        {
          "device_output_name": "solar_prediction",
          "device_names": "AA-70-2211-01-0078-938,AA-70-2211-01-0217-874,AA-70-2212-01-0028-070,HERMES_ESS000001,HERMES_ESS000002,HERMES_ESS000003,HERMES_PV000001,HERMES_PV000002",
          "fields": "SolarPower:PredictionSolarEnergyWh"
        }
      ],
      "time_function": "integral",
      "time_function_params": "{\"unit\":\"1h\"}",
      "group_function": "sum"
    },
    {
      "maps": [
        {
          "field": "PredictionSolarEnergy",
          "value": "r.PredictionSolarEnergyWh / 1000.0"
        }
      ]
    },
    {
      "sources": [
        {
          "device_output_name": "hermes_sun_photometer_data",
          "device_names": "HERMES_SP000001",
          "fields": "Irradiance"
        }
      ],
      "group_function": "mean"
    },
    {
      "sources": [
        {
          "device_output_name": "pomcube_data,hermes_ess_data",
          "device_names": "AA-70-2211-01-0078-938,AA-70-2211-01-0217-874,AA-70-2212-01-0028-070,HERMES_ESS000001,HERMES_ESS000002,HERMES_ESS000003",
          "fields": "SolarPower,GenPower"
        },
        {
          "device_output_name": "hermes_pv_inverter_data",
          "device_names": "HERMES_PV000001,HERMES_PV000002",
          "fields": "SolarPower"
        }
      ],
      "group_function": "sum"
    },
    {
      "sources": [
        {
          "device_output_name": "hermes_smartmeter_data",
          "device_names": "HERMES_SM000001,HERMES_SM000002,HERMES_SM000003",
          "fields": "Active_Power:GridPower"
        }
      ],
      "group_function": "sum"
    },
    {
      "sources": [
        {
          "device_output_name": "hermes_smartmeter_data",
          "device_names": "HERMES_SM000004,HERMES_SM000005,HERMES_SM000006",
          "fields": "Active_Power:LoadPower"
        }
      ],
      "group_function": "sum"
    },
    {
      "sources": [
        {
          "device_output_name": "hermes_smartmeter_data",
          "device_names": "HERMES_SM000004,HERMES_SM000005,HERMES_SM000006",
          "fields": "Active_Power:LoadEnergyWh"
        }
      ],
      "time_function": "integral",
      "time_function_params": "{\"unit\":\"1h\"}",
      "group_function": "sum"
    },
    {
      "maps": [
        {
          "field": "LoadEnergy",
          "value": "r.LoadEnergyWh / 1000.0"
        }
      ]
    },
    {
      "sources": [
        {
          "device_output_name": "pomcube_data,hermes_ess_data",
          "device_names": "AA-70-2211-01-0078-938,AA-70-2211-01-0217-874,AA-70-2212-01-0028-070,HERMES_ESS000001,HERMES_ESS000002,HERMES_ESS000003",
          "fields": "SolarEnergy,GridEnergy,GenEnergy,BatteryChargeEnergy,BatteryDischargeEnergy"
        },
        {
          "device_output_name": "hermes_pv_inverter_data",
          "device_names": "HERMES_PV000001,HERMES_PV000002",
          "fields": "SolarEnergy,GridEnergy,GenEnergy,BatteryChargeEnergy,BatteryDischargeEnergy"
        }
      ],
      "differenceNonNegativeSource": "true",
      "time_function": "sum",
      "group_function": "sum"
    },
    {
      "querys": [
        {
          "sources": [
            {
              "device_output_name": "pomcube_data,hermes_ess_data,device_spec",
              "device_names": "AA-70-2211-01-0078-938,AA-70-2211-01-0217-874,AA-70-2212-01-0028-070,HERMES_ESS000001,HERMES_ESS000002,HERMES_ESS000003",
              "fields": "BatSoC,BatCapacity"
            }
          ],
          "maps": [
            {
              "field": "BatRemainEnergy",
              "value": "r.BatCapacity * r.BatSoC / 100.0"
            }
          ],
          "group_function": "sum",
          "export_fields": "BatCapacity,BatRemainEnergy"
        }
      ]
    },
    {
      "maps": [
        {
          "field": "BatSoC",
          "value": "r.BatRemainEnergy / r.BatCapacity * 100.0"
        }
      ]
    },
    {
      "querys": [
        {
          "sources": [
            {
              "device_output_name": "solar_prediction",
              "device_names": "AA-70-2211-01-0078-938,AA-70-2211-01-0217-874,AA-70-2212-01-0028-070,HERMES_ESS000001,HERMES_ESS000002,HERMES_ESS000003,HERMES_PV000001,HERMES_PV000002",
              "fields": "SolarArea,SolarEff"
            }
          ],
          "maps": [
            {
              "field": "SolarEffArea",
              "value": "r.SolarEff * r.SolarArea"
            }
          ],
          "group_function": "sum"
        }
      ],
      "export_fields": "SolarArea,SolarEffArea"
    },
    {
      "maps": [
        {
          "field": "PhotometerSolarPower",
          "value": "r.Irradiance * r.SolarEffArea"
        }
      ]
    },
    {
      "maps": [
        {
          "field": "CurtailmentRatio",
          "value": "(r.PhotometerSolarPower-r.SolarPower)/r.PhotometerSolarPower*100.0"
        }
      ]
    }
  ]
}


const path = require('path');
const {InfluxDB, Point} = require('@influxdata/influxdb-client')

const { createCanvas } = require('canvas');
//const Chart = require('chart.js');
const Chart = require('chart.js/auto');
//import Chart from 'chart.js/auto';

const fs = require('fs');
//import moment from 'moment-timezone';
var moment = require('moment-timezone');
require('moment/locale/zh-tw');

const tmp = require('tmp');
var AdmZip = require("adm-zip");

const acorn = require('acorn');
const escodegen = require('escodegen');

type LastTriggerRecord = {
  event_id?:number,
  device_id?:number,
  result?:boolean|null,
  time?:number
};

type DeviceDataSource = {
  measurement: string,
  fields: string,
  where?: string,
  map?: string
};

@Injectable()
export class DeviceDataService {

  last_trigger_records:Array<LastTriggerRecord> = []

  constructor(
    public readonly influxdbClientService:InfluxdbClientService,
    public readonly domainService: DomainService,
    public readonly deviceTypeCategoryService: DeviceTypeCategoryService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceService: DeviceService,
    public readonly deviceOutputService: DeviceOutputService,
    public readonly eventService: EventService,
    public readonly appService: AppService,
    /*
    @InjectRepository(Domain) public readonly domainRepository: Repository<Domain>,
    @InjectRepository(DeviceType) public readonly deviceTypeRepository: Repository<DeviceType>,
    @InjectRepository(DataStorer) public readonly dataStorerRepository: Repository<DataStorer>,
    @InjectRepository(Device) public readonly deviceRepository: Repository<Device>,
    @InjectRepository(DeviceConnection) public readonly deviceConnectionRepository: Repository<DeviceConnection>,
    @InjectRepository(SensorSchema) public readonly sensorSchemaRepository: Repository<SensorSchema>,
    */
    //public readonly domainService: DomainService,
    //public readonly deviceService: DeviceService
  ) {
  }


  async triggerEvent(this_user:UserWithPermission, event, device, data) {
    try {
      var data_new = Object.assign({}, data);
      var context = {
        device: device,
        data: data_new
      }
      var ret = await DarkBox.evalScript(event.compare_function, context);

      var last_trigger_record = this.last_trigger_records.find(x=>x.event_id==event.event_id && x.device_id==device.device_id)

      if (event.trigger_onchange) {
        if (last_trigger_record==null || last_trigger_record.result==null) {
          last_trigger_record = {
            event_id: event.event_id,
            device_id: device.device_id,
            result: ret,
            time: Date.now()
          }
          this.last_trigger_records.push(last_trigger_record)
          return;
        } else {
          last_trigger_record.time = Date.now()
          if (last_trigger_record.result==ret) {
            return;
          } else {
            last_trigger_record.result=ret
          }
        }
      }

      if (ret==true) {
        var prev_time = 0;
        if (last_trigger_record==null) {
          last_trigger_record = {
            event_id: event.event_id,
            device_id: device.device_id,
            time: 0
          }
          this.last_trigger_records.push(last_trigger_record)
        } else {
          prev_time = last_trigger_record.time;
        }
        if (event.not_trigger_second==0 || Date.now()-prev_time>event.not_trigger_second*1000) {
          last_trigger_record.time = Date.now();
          //var re = new RegExp("`", "g");
          var m = event.message.replace(/\`/g, '\'');
          var new_message = await DarkBox.evalScript('`' + m + '`', context);
          if (new_message!=null && (''+new_message).trim()!='') {
            await this.appService.notifyUserByEvent(this_user, event, 'device', ''+new_message, device.device_id, null)
          }
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  async writeDeviceData(this_user:UserWithPermission, organization_id, measurement_name, json) {

    if (json==null) {
      throw new HttpException('"data" is invalid', HttpStatus.BAD_REQUEST);
    }

    var domain = await this.domainService.findOne(this_user, organization_id)
    if (domain==null) {
      throw new HttpException('Domain('+organization_id+') not found', HttpStatus.NOT_FOUND);
    }
    var devices = await this.domainService.getAllDevices(this_user, this.deviceService, organization_id, {}, 1000000);
    if (devices.length==0) return;

    var events = await this.eventService.findAll(this_user, {
      where: {domain_id: organization_id}
    });

    //var device_outputs = await this.deviceOutputService.findAll()

    var datas = [];
    if (Array.isArray(json)) {
      datas = json;
    } else {
      datas = [json]
    }

    var fields = []
    for (var data of datas) {
      for (name in data) {
        if (fields.indexOf(name)==-1) {
          fields.push(name)
        }
      }
    }


    var org = AppConfigService.getInfluxdbConfig().org;
    var influxdb_client = InfluxdbClientService.getClient();
    let writeClient = influxdb_client.getWriteApi(org, domain.domain_name, 'ms')
    
    var all_has_data = false;
    for (var data of datas) {
      var device_name = data['DeviceName']
      if (device_name==null || Object.keys(data).length<2) continue;
      try {
        var device = devices.find(x=>x.device_name==device_name);
        if (device==null) continue;

        let point = new Point(measurement_name)
        point.tag('DeviceName', device_name)

        /*
        var filter_device_outputs = device_outputs.filter(x=>x.device_type_id==device.device_type_id);
        var r = await DarkBox.evalScript(device_output.device_state_field, data, false)
        if (r!=null && r!=device.device_state) field_to_update['device_state'] = r;
        */

        var device_state = 'running'
        var is_online = true;
        if ('OnLine' in data) {
          if (data.OnLine==1) {
            is_online = true
          } else {
            is_online = false
            device_state = 'unknow'
          }
        }

        var has_data = false;
        for (var name in data) {
          if (name=='DeviceName') continue;
          if (name=='OnLine' || is_online) {
            var value = data[name]
            var v = parseFloat(value);

            var name2 = name
            if (name=='BatteryToTotal') name2 = 'BatteryChargeEnergy';
            if (name=='BatteryFromTotal') name2 = 'BatteryDischargeEnergy';
            //if (name=='BatteryPower') name2 = 'BatteryPower';
            if (name=='GridToTotal') name2 = 'GridSellEnergy';
            if (name=='GridFromTotal') name2 = 'GridPurchaseEnergy';
            

            if (!isNaN(v)) {
              point.floatField(name2, v)
              has_data = true;
            }
          }
        }
        if (has_data) {
          all_has_data = true;
          writeClient.writePoint(point)
        }

        
        var new_state = {
          "device_state": device_state,
          "is_online": is_online
        }
        if (is_online) {
          new_state["last_connect_time"] = (new Date()).toISOString()
        }
        await this.deviceService.update(this_user, device.device_id, new_state);

        for (var event of events) {
          var is_trigger = true;
          if (event.domain_id==null || event.device_type_id==null || device.device_type_id!=event.device_type_id) is_trigger=false;
          //if (device_output.device_output_id!=event.device_output_id) is_trigger = false;
          if (event.device_name!=null && event.device_name!='' && device.device_name!=event.device_name) is_trigger = false;
          if (is_trigger) {
            is_trigger = await this.domainService.includeDomain(event.domain_id, device.domain_id)
          }
          if (is_trigger) {
            await this.triggerEvent(this_user, event, device, data);
          }
        }

      } catch (ex) {console.log(ex)}
    }
    try {
      if (all_has_data) await writeClient.flush();
    } catch(ex2) {
      console.log(ex2.message);
      /*
      if (ex2.statusCode==404 && (/bucket [\s\S]+ not found/.test(''+ex2.message))) {
        try {
          //await influxDB.createDatabase(domain_name);
          await this.influxdb_client.createDatabase(domain_name)
          if (need_store) await writeClient.flush();
        } catch (ex3) {
          console.log(ex3);
        }
      }
      */
    }

  }

  async queryByFlux(fluxQuery, params:any={}, res:Response=null, bucket_name:string=null, measurement_name:string=null) {

    function parseKey(s) {
    //  s = s.replace(/,/g, "\\,")
    //  s = s.replace(/=/g, "\\=")
      s = s.replace(/ /g, "\\ ")
      return s
    }
    function parseTagValue(s) {
      if (s==null) return null;
      if (typeof(s)=='string') {
        var s2 = s.replace(/\\/g, "\\\\")
        return s2.replace(/ /g, "\\ ")
      }
      return s
    }

    function parseFieldValue(s) {
      if (s==null) return null;
      if (typeof(s)=='string') {
        var s2 = s.replace(/\\/g, "\\\\")
        s2 = s2.replace(/\"/g, "\\\"")
        return '"' + s2 + '"'
      }
      return s
    }

    function parseCsvCol(value) {
      if (value==null) {
        return 'null'
      } else if (typeof(value)=="number") {
        return '' + value
      } else {
        var s = '' + value
        s = '"' + s.replace(/\"/g, '""') + '"'
        return s
      }
    }

    var is_zip = (params.output_zip=='1' || params.output_zip=='true');
    let datas = null
    let tmpobj = null;
    let has_error = false
    let csv_header_outputed = false
    let csv_header = ''
    try {

      if (is_zip) {
        //const tmpobj = tmp.fileSync();
        tmpobj = tmp.fileSync({tmpdir:AppConfigService.getSystemConfig().tempfile_path});
        console.log('create tmp file: ', tmpobj.name);
        //console.log('Filedescriptor: ', tmpobj.fd);
      }

      datas = await (new Promise(async (resolve, reject) => {
        var config = AppConfigService.getInfluxdbConfig();
        var influxdb_client = InfluxdbClientService.getClient();

        let queryClient = influxdb_client.getQueryApi(config.org)

        var field_names = []
        if (params.output_format=='csv') {
          if (bucket_name==null) {
            reject(new HttpException('bucket_name is null', HttpStatus.BAD_REQUEST))
            return
          }
          if (measurement_name==null) {
            reject(new HttpException('measurement_name is null', HttpStatus.BAD_REQUEST))
            return
          }
          try {

            field_names = []
            if (params.fields!=null) {
              field_names = params.fields.split(',')
            } else {
              var q = `
  import "influxdata/influxdb/schema"

  tagKeys = schema.tagKeys(bucket: "${bucket_name}", predicate: (r) => r._measurement == "${measurement_name}")
    |> map(fn: (r) => ({ r with type: "tagKey" }))

  fieldKeys = schema.fieldKeys(bucket: "${bucket_name}", predicate: (r) => r._measurement == "${measurement_name}")
    |> map(fn: (r) => ({ r with type: "fieldKey" }))

  union(tables: [tagKeys, fieldKeys])
    |> sort(columns: ["type"], desc: true)`

              /*
              var q = 'import "influxdata/influxdb/schema"' + "\n"
              q += `tagKeys = schema.tagKeys(bucket: "${bucket_name}", predicate: (r) => r._measurement == "${measurement_name}")` + "\n"
              q += `fieldKeys = schema.fieldKeys(bucket: "${bucket_name}", predicate: (r) => r._measurement == "${measurement_name}")` + "\n"
              q += `union(tables: [tagKeys, fieldKeys])`
              */
              var data_fields = await this.queryByFlux(q)
              for (var data_field of data_fields) {
                var field_name = data_field._value
                if (!(field_name=='_start' || field_name=='_stop' || field_name=='_field' || field_name=='_measurement')) {
                  field_names.push(field_name)
                }
              }
            }
            field_names.unshift('_time')
            csv_header = field_names.map(x=>(x=='_time')?'"time"':parseCsvCol(x)).join(',')
          } catch (ex) {
            reject(ex)
            return
          }
        }


        let datas = null;
        let data_count = 0;
        if (is_zip) {
          if (params.output_format=='csv' || params.output_format=='influx_line_protocol') {
          } else {
            fs.writeSync(tmpobj.fd, '[')
          }
        } else {
          if (params.output_format=='csv' || params.output_format=='influx_line_protocol') {
            datas = '';
          } else {
            datas = [];
          }
        }

        function outData(data) {
          if (is_zip) {
            fs.writeSync(tmpobj.fd, data)
          } else {
            datas += data
          }
        }

        queryClient.queryRows(fluxQuery, {
          next: (row, tableMeta) => {
            const tableObject = tableMeta.toObject(row)
            //console.log(tableObject)
            delete tableObject.result;
            delete tableObject._start;
            delete tableObject._stop;

            if (params.output_format=='csv') {
              if (!csv_header_outputed) {
                outData(csv_header + '\n')
                csv_header_outputed = true
              }
              var d = []
              for (var field_name of field_names) {
                d.push(parseCsvCol(tableObject[field_name]))
              }
              outData(d.join(',') + '\n')
            } else if (params.output_format=='influx_line_protocol') {
              var tags = ''
              var fields = []
              for (var n in tableObject) {
                if (n=='_time' || n=='table' || n=='_value' || n=='_measurement' || tableObject[n]==null) continue;
                var column = tableMeta.columns.find(x=>x.label==n)
                if (column==null) continue;
                if (column.group) {
                  if (n=='_field') {
                    fields.push(parseKey(tableObject._field) + '=' + parseFieldValue(tableObject._value))
                  } else {
                    tags += ',' + parseKey(n) + '=' + parseTagValue(tableObject[n])
                    /*
                    if (n=='device_name') continue;
                    var n2 = n;
                    if (n=='device_sn') n2 = 'DeviceName';
                    if (n=='device_order') n2 = 'PlaceName';
                    tags += ',' + parseKey(n2) + '=' + parseKey(tableObject[n])
                    */
                  }
                } else {
                  fields.push(parseKey(n) + '=' + parseFieldValue(tableObject[n]))
                  /*
                  var n2 = n;
                  var v2 = tableObject[n]
                  if (n=='GridFromTotal') {
                    n2 = 'GridEnergy';
                    v2 = tableObject[n] / 1000;
                  }
                  if (n=='LoadToTotal') {
                    n2 = 'LoadEnergy';
                    v2 = tableObject[n] / 1000;
                  }
                  if (n=='PVTotal') {
                    n2 = 'SolarEnergy';
                    v2 = tableObject[n] / 1000;
                  }
                  if (n=='GeneratorFromTotal') {
                    n2 = 'GenEnergy';
                    v2 = tableObject[n] / 1000;
                  }
                  if (n=='BatteryFromTotal') {
                    n2 = 'BatEnergy';
                    v2 = tableObject[n] / 1000;
                  }
                  if (n=='SolarPower') {
                    n2 = 'SolarPower';
                    v2 = tableObject[n];
                  }
                  if (n=='GenPower') {
                    n2 = 'GenPower';
                    v2 = tableObject[n];
                  }
                  if (n=='LoadPower') {
                    n2 = 'LoadPower';
                    v2 = tableObject[n];
                  }
                  if (n=='GridPower') {
                    n2 = 'GridPower';
                    v2 = tableObject[n];
                  }
                  if (n=='SOC') {
                    n2 = 'BatSoC';
                    v2 = tableObject[n] / 10;
                  }
                  if (n=='MinCellTemp') {
                    n2 = 'EnvTemp1';
                    v2 = tableObject[n] / 10;
                  }
                  if (n=='MaxCellTemp') {
                    n2 = 'EnvTemp2';
                    v2 = tableObject[n] / 10;
                  }
                  if (n=='TotalCurr') {
                    n2 = 'BatCurr';
                    v2 = tableObject[n] / 100;
                  }
                  if (n=='TotalVolt') {
                    n2 = 'BatVolt';
                    v2 = tableObject[n] / 100;
                  }
                  fields.push(parseKey(n2) + '=' + parseField(v2))
                  */
                }
              }
              var time = (new Date(tableObject._time)).getTime()*1000000
              var measurement_name = tableObject._measurement.replace(/ /g,'\\ ')
              var data = `${measurement_name}${tags} ${fields.join(',')} ${time}\n`
              //var data = `pomcube_data${tags} ${fields.join(',')} ${time}\n`

              if (is_zip) {
                fs.writeSync(tmpobj.fd, data)
              } else {
                datas += data
              }
            } else {
              delete tableObject._measurement;
              if (is_zip) {
                var dot = data_count==0?'':',';
                fs.writeSync(tmpobj.fd, dot+JSON.stringify(tableObject))
              } else {
                datas.push(tableObject)
              }
            }
            data_count ++;
          },
          error: (error) => {
            console.error('\nError', error)
            reject(error)
          },
          complete: () => {
            console.log('\nSuccess')
            if (params.output_format=='csv' && !csv_header_outputed) {
              outData(csv_header + '\n')
              csv_header_outputed = true
            }
            resolve(datas)
          },
        })
      }));
    } catch (ex) {
      //console.log(ex)
      has_error = true
      throw ex
    } finally {
      if (tmpobj!=null) {
        try {
          if (is_zip) {
            if (!has_error) {
              if (params.output_format!='influx_line_protocol') {
                fs.writeSync(tmpobj.fd, ']')
              }

              // creating archives
              var zip = new AdmZip();

              // add file directly
              //var content = "inner content of the file";
              //zip.addFile("test.txt", Buffer.from(content, "utf8"), "entry comment goes here");

              // add local file
              //zip.addLocalFile(tmpobj.name, 'data.txt');
              // get everything as a buffer
              //var willSendthis = zip.toBuffer();
              // or write everything to disk

              var zipfile_data:Buffer = fs.readFileSync(tmpobj.name);
              zip.addFile('data.txt', zipfile_data)

              const file_path_zip = tmp.tmpNameSync({tmpdir:AppConfigService.getSystemConfig().tempfile_path}) + '.zip';
              //var file_path_zip = AppConfigService.getSystemConfig().tempfile_path + '/datas.zip'
              zip.writeZip(file_path_zip);

              var stats = fs.statSync(file_path_zip)
              var fileSizeInBytes = stats.size;

              if (res!=null) {
                res.set({
                  'Content-Type': 'application/zip',
                  'Content-Disposition': 'attachment; filename=data.zip',
                //  'Content-Disposition': 'inline',
                  'Content-Length': fileSizeInBytes,
                })
                //const file = createReadStream(file_path_zip);
                //file.pipe(res);

                await (new Promise<void>(function(resolve, reject) {

                  var readerStream = fs.createReadStream(file_path_zip);
                  //readerStream.setEncoding('UTF8');
    
                  readerStream.on('data', function(chunk) {
                    res.write(chunk)
                  });

                  readerStream.on('end',function(){
                    resolve()
                  });

                  readerStream.on('error', function(err) {
                    reject(err)
                  });
                }));

                res.end()
              }
              fs.unlinkSync(file_path_zip);
            }
          }
        } catch (ex) {
          console.log(ex)
          if (is_zip) {
            if (res!=null) res.end()
          }
        }

        // If we don't need the file anymore we could manually call the removeCallback
        // But that is not necessary if we didn't pass the keep option because the library
        // will clean after itself.
        tmpobj.removeCallback();
      }
    }
    return datas;
  }

  checkDate(date) {
    if (/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/.test(date)) {
    // "2023-09-01T00:00:00.000Z" - ISO Date
    return true;
    } else if(/^[+-]?([0-9]*[.])?[0-9]+([smhdwy]|mo)?$/.test(date)) {
    // 1621726200, -5d
    return true;
    }
    return false;
  }

  static putWhere(where, field_name, value) {
    var w = where[field_name];
    if (Array.isArray(w)) {
      if (typeof(value)=="string") {
        w.push(value.trim())
      }
    } else if (typeof(w)=="string") {
      where[field_name] = [];
      where[field_name].push(w);
      where[field_name].push(value.trim());
    } else {
      if (typeof(value)=="string") {
        where[field_name] = value.trim();
      }
    }
  }

  async filterDevice(this_user:UserWithPermission, param) {

    var sources:DeviceDataSource[] = []

    if (param?.organization_id==null) {
      throw new HttpException('organization_id is needed', HttpStatus.BAD_REQUEST);
    }
    var organization = await this.domainService.findOne(this_user, param.organization_id)
    if (organization==null) {
      throw new HttpException('organization(domain) not found', HttpStatus.NOT_FOUND);
    }

    var where = null;
    if (param.where!=null) {
      where = JSON.parse(param.where)
    }
    if (where==null) where = {};

    //if (params.device_output_name == DeviceDataPredictionService.SOLAR_PREDICTION_MEASUREMENT_NAME) {}

    var device_types = null
    var device_outputs = []
    var device_output_reserved_names = []

    if (param.device_output_name=='*') {
      device_outputs = []
    } else if (param.device_output_name!=null) {
      var device_output_names = param.device_output_name.split(',')
      var device_output_other_names = []
      for (var name of device_output_names) {
        if (name==DeviceDataPredictionService.SOLAR_PREDICTION_MEASUREMENT_NAME || name=='device_spec') {
          device_output_reserved_names.push(name)
        } else {
          device_output_other_names.push(name)
        }
      }
      if (device_output_other_names.length>0) {
        device_outputs = await this.deviceOutputService.findAll(this_user, {
          where:{
            device_output_name: In(device_output_other_names)
          }
        })
      }
    } else {
      device_outputs = await this.deviceOutputService.findAll(this_user)
    }

    if (param.device_type_name!=null || param.device_type_category_name!=null) {
      device_types = await this.deviceTypeService.findAll(this_user)
      if (param.device_type_name!=null) {
        var device_type_names = param.device_type_name.split(',')
        device_types = device_types.filter(x => device_type_names.find(
          x2 => x2==x.device_type_name
        )!=null)
      }
      if (param.device_type_category_name!=null) {
        var device_type_category_names = param.device_type_category_name.split(',')
        var device_type_categorys = await this.deviceTypeCategoryService.findAll(this_user, {
          where: {
            device_type_category_name: In(device_type_category_names)
          }
        })
        device_types = device_types.filter(x => device_type_categorys.find(
          x2 => x2.device_type_category_id==x.device_type_category_id
        )!=null)
      }
      //for (var n=device_outputs.length-1; n>=0; n--) {
      //  if (device_types.find(x=>x.device_type_id==device_outputs[n].device_type_id)==null) {
      //    device_outputs.splice(n, 1)
      //  }
      //}
      device_outputs = device_outputs.filter(x => device_types.find(
        x2 => x2.device_type_id==x.device_type_id
      )!=null)
    }

    var device_output_names2 = device_outputs.map(x=>x.device_output_name)
    device_output_names2 = device_output_names2.concat(device_output_reserved_names)

    if (device_output_names2.length==0 && param.device_output_name!='*') {
      return null;
    }

    if (!(
      param.domain_id==null &&
      param.device_names==null &&
      param.place_names==null &&
      device_types==null
    )) {
      var DEVICE_NAME_FIELD = AppConfigService.DEVICE_NAME_FIELD;
      var PLACE_NAME_FIELD = AppConfigService.PLACE_NAME_FIELD;

      var domain_id;
      if (param.domain_id!=null) {
        domain_id = param.domain_id
        if (!await this.domainService.includeDomain(param.organization_id, domain_id)) {
          throw new HttpException('domain not in organization', HttpStatus.BAD_REQUEST);
        }
      } else {
        domain_id = param.organization_id
      }
      let args = {}
      if (device_types!=null) {
        var device_type_ids = device_types.map(x=>x.device_type_id)
        args['device_type_id'] = In(device_type_ids)
      }
      if (param.device_names!=null) {
        var device_names = param.device_names.split(',')
        if (param.device_names!=null) {
          args['device_name'] = In(device_names)
        }
      }
      if (param.place_names!=null) {
        var place_names = param.place_names.split(',')
        if (param.place_names!=null) {
          args['place_name'] = In(place_names)
        }
      }
      var devices:Array<Device> = await this.domainService.getAllDevices(this_user, this.deviceService, domain_id, args, 1000000);
      if (devices.length==0) return null;

      if (param.place_names!=null) {
        var param_place_names = param.place_names.split(',');
        devices = devices.filter(x => param_place_names.find(
          x2 => x2==x.place_name
        )!=null)
      }
      if (param.device_names!=null) {
        var param_device_names = param.device_names.split(',');
        devices = devices.filter(x => param_device_names.find(
          x2 => x2==x.device_name
        )!=null)
      }

      for (var device of devices) {
        if (param.place_names!=null && param_place_names.find(device.place_name)!=null) {
          DeviceDataService.putWhere(where, PLACE_NAME_FIELD, device.place_name)
        } else {
          DeviceDataService.putWhere(where, DEVICE_NAME_FIELD, device.device_name)
        }
      }

      sources.push({
        measurement: device_output_names2.join(","),
        where: JSON.stringify(where),
        fields: param.fields
      })

      var all_outputs = await this.deviceOutputService.findAll(this_user)

      var param_fields = param?.fields?.split(',')
      if (param_fields==null) param_fields = [];

      for (var device of devices) {
        if (device.external_devices!=null && device.external_devices!='') {
          var external_devices = device.external_devices.split(",")
          let w = {}
          for (var external_device of external_devices) {
            DeviceDataService.putWhere(w, DEVICE_NAME_FIELD, external_device)
          }
          var outputs = all_outputs.filter(x=>x.device_type_id==device.device_type_id)
          for (var output of outputs) {
            try {
              if (output.properties!=null && (''+output.properties).trim()!='') {
                var properties = JSON.parse(output.properties)
                if (properties!=null) {
                  let measurements = {}
                  for (var property_fullname in properties) {
                    var property = properties[property_fullname]
                    var external = property.external
                    if (external!=null && external.device_output_name!=null && external.field!=null) {
                      if (param_fields.indexOf(external.field)!=-1) {
                        if (!(external.device_output_name in measurements)) {
                          measurements[external.device_output_name] = []
                        }
                        measurements[external.device_output_name].push(external.field)
                      }
                    }
                  }

                  for (var measurement_name in measurements) {
                    let fields = measurements[measurement_name]
                    let map = {
                      "_measurement": `"${output.device_output_name}"`,
                      "DeviceName": `"${device.device_name}"`
                    }
                    sources.push({
                      measurement: measurement_name,
                      fields: fields.join(','),
                      where: JSON.stringify(w),
                      map: JSON.stringify(map)
                    })
                  }
                }
    
              }
            } catch (ex) {console.log(ex)}
          }
        }
      }


    }

    return {
      organization: organization,
      device_output_names: device_output_names2.join(","),
      where: where,
      sources: sources
    }

  }

  //async query(domainService:DomainService, deviceTypeService:DeviceTypeService, deviceService:DeviceService, deviceOutputService:DeviceOutputService, params) {
  async query(this_user:UserWithPermission, param, res:Response=null) {

    var w = await this.filterDevice(this_user, param)
    if (w==null) return [];
    param.where = JSON.stringify(w.where)

    //var no_data = await this.updateWhere(params)
    //if (no_data) return [];

    //var measurement_name = (param.device_output_name!='*')?w.device_output_names.join(','):null;

    return await this.queryInfluxMultiSource(w.organization.domain_name, w.sources, param, res)
    //return await this.queryInflux(w.organization.domain_name, measurement_name, params, res);
  }

  async queryInflux(bucket_name, measurement_name, param, res:Response=null) {
    var sources:Array<DeviceDataSource> = []
    sources.push({
      measurement: measurement_name,
      fields: param.fields
    })
    return await this.queryInfluxMultiSource(bucket_name, sources, param, res)
  }
  async queryInfluxMultiSource(bucket_name, sources:Array<DeviceDataSource>|string, param, res:Response=null) {

    function getTimeFunctionParamString() {
      let kvs = []
      if (param.time_function_params!=null && (''+param.time_function_params).trim()!='') {
        let time_function_params = JSON.parse(param.time_function_params)
        for (let param_name in time_function_params) {
          let value = time_function_params[param_name]
          if (/[^0-9a-zA-Z\.]/.test(param_name)) {
            throw new HttpException('"time_function_params" is invalid.', HttpStatus.BAD_REQUEST);
          }
          if (!(/[0-9a-zA-Z\.]+/.test(value) || /^\"[0-9a-zA-Z\_\-\. ]*\"$/.test(value))) {
            throw new HttpException('"time_function_params" is invalid.', HttpStatus.BAD_REQUEST);
          }
          kvs.push(param_name + ':' + value)
        }
      }
      return kvs.join(',')
    }

    var last_qname = null

    if (param==null) {
      throw new HttpException('params is needed', HttpStatus.BAD_REQUEST);
    }

    var empty_result = ''
    //if (param.output_format=='influx_query') {}

    //var config = AppConfigService.getInfluxdbConfig();
    var fluxQuery = '';

    if (''+param.import_join=='true') {
      fluxQuery += 'import "join"' + '\n'
    }

    if (param.timezone!=null) {
      if (/[^a-zA-Z0-9\/]/.test(param.timezone)) {
        throw new HttpException('"timezone" is invalid', HttpStatus.BAD_REQUEST);
      }
      if (''+param.has_import!='false') {
        fluxQuery += `import "timezone"\n`;
        fluxQuery += `option location = timezone.location(name: "${param.timezone}")\n`;
      }
    }

    if (param.start==null) param.start='-2d';

    if (!this.checkDate(param.start)) {
      throw new HttpException('"start" is invalid. ex: "2023-09-01T00:00:00.000Z", "1621726200", "-10s", "-30m", "-6h", "-7d", "-1mo", "-1y"', HttpStatus.BAD_REQUEST);
    }

    var is_difference = (param.difference=='1' || param.difference=='true')
    var is_pivot_columns = param.pivot_columns!=null && (''+param.pivot_columns).trim()!=''

    if (typeof sources=="string") {
      fluxQuery += sources
    } else {
      var qnames = []
      for (var source_index=0; source_index<sources.length; source_index++) {
        var source = sources[source_index]

        var qname = 'q' + Util.createRandomID()
        last_qname = qname
        qnames.push(qname)

        fluxQuery += "\n" + `${qname}=from(bucket: "${bucket_name}")`
        if (param.stop!=null) {
          if (!this.checkDate(param.stop)) {
            throw new HttpException('"stop" is invalid. ex: "2023-09-01T00:00:00.000Z", "1621726200", "-5d"', HttpStatus.BAD_REQUEST);
          }
          fluxQuery += `|> range(start: ${param.start}, stop: ${param.stop})`
        } else {
          fluxQuery += `|> range(start: ${param.start})`
        }

        var measurement_name = source.measurement
        if (measurement_name!=null && measurement_name.trim()!='') {
          if (!/^[0-9a-zA-Z_,]+$/.test(measurement_name)) {
            throw new HttpException('"measurement_name" is invalid.', HttpStatus.BAD_REQUEST);
          }
          var measurement_name_arr = measurement_name.split(',');
          var measurement_name_query = '';
          for (var n=0; n<measurement_name_arr.length; n++) {
            var mname = measurement_name_arr[n];
            if (n!=0) measurement_name_query += ' or '
            measurement_name_query += 'r["_measurement"]=="'+mname+'"'
          }
          fluxQuery += `|> filter(fn: (r) => ${measurement_name_query})`
          //fluxQuery += `|> filter(fn: (r) => r._measurement=="${measurement_name}")`
        }

        var fields = source.fields
        if (fields!=null && !/^(\w+(:\w+)*,)*\w+(:\w+)*$/.test(''+fields)) {
          throw new HttpException('"fields" is invalid. ex: "field1,field2,field3"', HttpStatus.BAD_REQUEST);
        }

        if (fields!=null) {
          var fields_arr = fields.split(',');
          var fields_query = '';
          var renames = []
          for (var n=0; n<fields_arr.length; n++) {
            var field = fields_arr[n];
            var old_new = field.split(':')
            if (old_new.length==2) {
              renames.push({
                old_field: old_new[0],
                new_field: old_new[1]
              })
            }
            var old_field = old_new[0]
            if (n!=0) fields_query += ' or '
            fields_query += 'r["_field"] == "'+old_field+'"'
          }
          fluxQuery += '|> filter(fn: (r) => ' + fields_query + ')'
          for (let rename of renames) {
            fluxQuery += `|> map(fn: (r) => ({r with _field: if r._field=="${rename.old_field}" then "${rename.new_field}" else r._field}))`
          }
        }

        var where_query = ''
        if (source.where!=null && (''+source.where).length>0) {
          var where = JSON.parse(source.where);
          for (var name in where) {
            var value = where[name];
            var name2 = name.trim().replace(/\\/g, "\\\\")
            name2 = name2.replace(/\"/g, "\\\"")
            if (name2=='') continue;
            if (Array.isArray(value)) {
              // |> filter(fn: (r) => r["device_name"] == "3096" or r["device_name"] == "3290")
              var cond_ors = [];
              for (var v of value) {
                if (typeof(v)!='string') continue;
                var v2 = v.replace(/\\/g, "\\\\")
                v2 = v2.replace(/\"/g, "\\\"")
                cond_ors.push('r["'+name2+'"] == "'+v2+'"')
              }
              if (cond_ors.length>0) {
                where_query += '|> filter(fn: (r) => ' + cond_ors.join(' or ') + ')'
              }
            } else if (typeof(value)=='string') {
              var value2 = value.replace(/\\/g, "\\\\")
              value2 = value2.replace(/\"/g, "\\\"")
              var w = 'r["'+name2+'"] == "'+value2+'"'
              where_query += '|> filter(fn: (r) => ' + w + ')'
            } else if (typeof(value)=='number') {
              var w = 'r["'+name2+'"] == "'+value+'"'
              where_query += '|> filter(fn: (r) => ' + w + ')'
            }
          }
        }
        fluxQuery += where_query

        if (source.map!=null && (''+source.map).length>0) {
          try {
            let map = JSON.parse(source.map)
            let kvs = []
            for (let tag_name in map) {
              var tag_value = map[tag_name]
              if (! (/[a-zA-Z0-9_]+/.test(tag_name))) {
                throw new HttpException('"map" is invalid', HttpStatus.BAD_REQUEST);
              }
              if (!(/[A-Za-z0-9\_\+\-\*\/\.\(\) ]+/.test(tag_value))) {
                throw new HttpException('"map" is invalid', HttpStatus.BAD_REQUEST);
              }
              if (!Util.checkParenthesesBalance(tag_value)) {
                throw new HttpException('map.value is invalid. Asymmetrical brackets.', HttpStatus.BAD_REQUEST);
              }

              kvs.push(`${tag_name}:${tag_value}`)
            }
            //fluxQuery += `|> map(fn: (r) => ({r with _measurement: "xxx", DeviceName: "zzz"}))`
            if (kvs.length>0) fluxQuery += `|> map(fn: (r) => ({r with ${kvs.join(',')}}))`
          } catch (ex) {
            throw new HttpException('"map" is invalid. ' + ex, HttpStatus.BAD_REQUEST);
          }
        }

      }

      if (qnames.length==0) {
        return empty_result
      } else if (qnames.length==1) {
        //fluxQuery += "\n" + qnames[0]
      } else {
        last_qname = 'q' + Util.createRandomID()
        fluxQuery += "\n" + last_qname + `=union(tables:[${qnames.join(",")}])`
      }
    }

    //fluxQuery += "\n" + `${qname}=from(bucket: "${bucket_name}")`

    if(param.group_by!=null && /[^!a-zA-Z0-9 _,]/.test(param.group_by)) {
      throw new HttpException('"group_by" is invalid.', HttpStatus.BAD_REQUEST);
    }

    var group_by_last = '';
    if (param.group_by!=null) {
      let group_by_arr = param.group_by.split(',');
      let group_by_first_arr = [];
      let group_by_last_arr = [];
      for (var g of group_by_arr) {
        if (g.trim()!='') {
          if (g.charAt(0)=='!') {
            group_by_first_arr.push('"' + g.substring(1,g.length) + '"');
          } else {
            group_by_first_arr.push('"' + g + '"');
            group_by_last_arr.push('"' + g + '"');
          }
        }
      }
      let group_by_first = group_by_first_arr.join(',')
      group_by_last = group_by_last_arr.join(',')
      fluxQuery += `|> group(columns: [${group_by_first}])`
      fluxQuery += '|> sort(columns: ["_time"])'
    }

    if ((param.differenceNonNegativeSource=='1' || param.differenceNonNegativeSource=='true')) {
      fluxQuery += '|> difference(nonNegative: true)'
    }

    var funcs = ['first', 'last', 'min', 'max', 'mean', 'median', 'count', 'sum', 'spread', 'integral'];
    if (param.every!=null) {
      //if (params.group_by!=null) {
      //  fluxQuery += `|> group(columns: [${group_by_new}])`
      //}

      var tfps = getTimeFunctionParamString()
      
      if(!/^([0-9]*[.])?[0-9]+([smhdw]|mo)$/.test(param.every)) {
        throw new HttpException('"every" is invalid. ex: "10s", "1m", "2h", "1d", "1w", "1mo", "1y"', HttpStatus.BAD_REQUEST);
      }
      if (funcs==null) {
        throw new HttpException('"time_function" is needed when params.every is set', HttpStatus.BAD_REQUEST);
      }
      if (funcs.indexOf(param.time_function)==-1) {
        throw new HttpException('"time_function" is invalid. ex: ' + funcs.join(','), HttpStatus.BAD_REQUEST);
      }
      var createEmpty = (param.create_empty=='1' || param.create_empty=='true')
      if (param.time_src!=null) {
        if (!(param.time_src=='_start' || param.time_src=='_stop')) {
          throw new HttpException('"time_src" is invalid. ex: one of ["_start", "_stop"]', HttpStatus.BAD_REQUEST);
        }
      }

      var fnString = ''
      var timeSrcString = ''
      var locationString = ''

      if (param.timezone!=null) {
        locationString = ', location:location'
      }
      if (param.time_src!=null) {
        timeSrcString = `, timeSrc:"${param.time_src}"`
      }
      if (tfps=='') {
        fnString = `, fn:${param.time_function}`
      } else {
        fnString = `, fn:(column, tables=<-) => tables |> ${param.time_function}(${tfps})`
      }
      fluxQuery += `|> aggregateWindow(every:${param.every}, createEmpty:${createEmpty}${fnString}${timeSrcString}${locationString})`

      /*
      if (param.timezone!=null) {
        if (param.time_src!=null) {
          fluxQuery += `|> aggregateWindow(every: ${param.every}, fn: ${param.time_function}, createEmpty: ${createEmpty}, timeSrc: "${param.time_src}", location: location)`
        } else {
          fluxQuery += `|> aggregateWindow(every: ${param.every}, fn: ${param.time_function}, createEmpty: ${createEmpty}, location: location)`
        }
      } else {
        if (param.time_src!=null) {
          fluxQuery += `|> aggregateWindow(every: ${param.every}, fn: ${param.time_function}, createEmpty: ${createEmpty}, timeSrc: "${param.time_src}")`
        } else {
          fluxQuery += `|> aggregateWindow(every: ${param.every}, fn: ${param.time_function}, createEmpty: ${createEmpty})`
        }
      }
      */
      if (is_difference) {
        fluxQuery += `|> difference()`
      }
    } else {
      //if (params.group_by!=null) {
      //  fluxQuery += `|> group(columns: [${group_by_new}])`
      //}
      if (param.time_function!=null) {
        if (funcs.indexOf(param.time_function)==-1) {
          throw new HttpException('"time_function" is invalid. ex: ' + funcs.join(','), HttpStatus.BAD_REQUEST);
        }
        var tfps = getTimeFunctionParamString()
        fluxQuery += `|> ${param.time_function}(${tfps})`
      }
    }

    if (param.group_function!=null) {
      if (param.every!=null) {
        if (param.group_by!=null && group_by_last!=null && group_by_last.trim()!='') {
          fluxQuery += `|> group(columns: ["_time",${group_by_last}])`;
        } else {
          fluxQuery += `|> group(columns: ["_time"])`;
        }
      } else {
        if (param.group_by!=null) {
          fluxQuery += `|> group(columns: [${group_by_last}])`
        } else {
          fluxQuery += `|> group()`;
        }
      }
      var funcs = ['min', 'max', 'mean', 'median', 'count', 'sum'];
      if (funcs.indexOf(param.group_function)==-1) {
        throw new HttpException('"group_function" is invalid. ex: ' + funcs.join(','), HttpStatus.BAD_REQUEST);
      }
      fluxQuery += `|> ${param.group_function}()`;
    }
    if (param.every!=null) {
      if (param.group_by!=null) {
        fluxQuery += `|> group(columns: [${group_by_last}])`
      } else {
        fluxQuery += `|> group()`;
      }
    }

    if (is_pivot_columns) {
      if (param.every==null) {
        fluxQuery += `|> map(fn: (r) => ({r with _time: now()}))`
      }
      var pivot_columns_arr = (''+param.pivot_columns).split(',')
      var pivot_columns = [];
      for (var column of pivot_columns_arr) {
        if (/^[0-9a-zA-Z_]+$/.test(column)) {
          pivot_columns.push('"' + column + '"')
        }
      }
      if (pivot_columns.length>0) {
        fluxQuery += `|> pivot(rowKey: ["_time"], columnKey: [${pivot_columns.join(',')}], valueColumn: "_value")`;
      }
    }

    if (param.maps!=null) {
      var maps = JSON.parse(param.maps)
      if (!Array.isArray(maps)) {
        throw new HttpException('"maps" must be Array', HttpStatus.BAD_REQUEST);
      }
      for (var map of maps) {
        if (!(/[A-Za-z0-9\_]+/.test(map.field))) {
          throw new HttpException('map.field is invalid.', HttpStatus.BAD_REQUEST);
        }
        if (!(/[A-Za-z0-9\_\+\-\*\/\.\(\) ]+/.test(map.value))) {
          throw new HttpException('map.value is invalid.', HttpStatus.BAD_REQUEST);
        }
        if (!Util.checkParenthesesBalance(map.value)) {
          throw new HttpException('map.value is invalid. Asymmetrical brackets.', HttpStatus.BAD_REQUEST);
        }
        fluxQuery += `|> map(fn: (r) => ({r with ${map.field}: ${map.value}}))`
      }
    }

    if (param.sort_columns!=null && (''+param.sort_columns).trim()!='') {
      //'|> sort(columns: ["_time"], desc: false)'
      var desc = (param.sort_desc=='1' || param.sort_desc=='true')
    }

    var is_zip = (param.output_zip=='1' || param.output_zip=='true');
    var limit = parseInt(param.limit);
    if (is_zip) {
      if (isNaN(limit)) limit = null;
    } else {
      if (isNaN(limit)) limit = 2000;
      if (limit>10000) limit=10000;
    }

    if (limit!=null && !isNaN(limit)) {
      if (''+param.has_limit!='false') {
        fluxQuery += `|> limit(n: ${limit})`
      }
    }

    if (!(''+param.no_output=='true')) {
      if (last_qname!=null) {
        fluxQuery += '\n' + last_qname + '\n'
      }
    }

    console.log(fluxQuery.replaceAll('|>', '\n|>'));


    /*
    fluxQuery = `
from(bucket: "aegis")
  |> range(start: 2024-02-23T16:00:00Z, stop: 2024-03-10T16:00:00Z)
  |> filter(fn: (r) => r["_measurement"] == "pomcube")
  |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
`
  */

    if (param.output_format=='influx_query') {
      return {
        flux: fluxQuery,
        last_qname
      }
    }

    if (param.debug=='1' || param.debug=='true') {
      return {
        params: param,
        flux: fluxQuery
      }
    }
    //return fluxQuery.replaceAll('|>', '<br>|>');

    var datas:any = await this.queryByFlux(fluxQuery, param, res, bucket_name, measurement_name);



    return datas;
  }

  async getPR(this_user:UserWithPermission, params) {

    /*
    var has_domain_id = (params.domain_id!=null && (''+params.domain_id).trim()!='')
    var has_device_names = (params.device_names!=null && (''+params.device_names).trim()!='')
    var has_place_names = (params.place_names!=null && (''+params.place_names).trim()!='')

    var organization_id = parseInt(params.organization_id)
    if (isNaN(organization_id)) {
      throw new HttpException('organization_id is invalid', HttpStatus.BAD_REQUEST);
    }

    var organization = await this.domainService.findOne(organization_id)
    if (organization==null) {
      throw new HttpException('organization not found', HttpStatus.NOT_FOUND);
    }
    var organization_name = organization.domain_name

    if (has_domain_id && !(await this.domainService.includeDomain(organization_id, params.domain_id))) {
      throw new HttpException('domain not in organization', HttpStatus.BAD_REQUEST);
    }
    
    var device_query_args = {}
    if (params.device_type_name!=null) {
      var device_type = await this.deviceTypeService.findAll({
        where:{
          device_type_name: params.device_type_name
        }
      })
      if (device_type.length==0) {
        throw new HttpException('device_type not found', HttpStatus.NOT_FOUND);
      }
      device_query_args["device_type_id"] = device_type[0].device_type_id
    }
    var devices = []
    if (has_domain_id) {
      var domain_id2 = parseInt(params.domain_id)
      if (isNaN(domain_id2)) {
        throw new HttpException('domain_id is invalid', HttpStatus.BAD_REQUEST);
      }
      devices = await this.domainService.getAllDevices(this.deviceService, domain_id2, device_query_args, 1000000)
    } else {
      devices = await this.domainService.getAllDevices(this.deviceService, organization_id, device_query_args, 1000000)
    }

    if (has_device_names) {
      var device_names_arr = params.device_names.split(',')
      for (var n=devices.length-1; n>=0; n--) {
        var device = devices[n]
        if (device_names_arr.find(x=>x==device.device_name)==null) {
          devices.splice(n,1)
        }
      }
    }

    if (has_place_names) {
      var place_names_arr = params.place_names.split(',')
      for (var n=devices.length-1; n>=0; n--) {
        var device = devices[n]
        if (place_names_arr.find(x=>x==device.place_name)==null) {
          devices.splice(n,1)
        }
      }
    }

    var where = null;
    if (params.where!=null) {
      where = JSON.parse(params.where)
    }
    if (where==null) where = {};

    var DEVICE_NAME_FIELD = AppConfigService.DEVICE_NAME_FIELD;
    var PLACE_NAME_FIELD = AppConfigService.PLACE_NAME_FIELD;

    if (has_domain_id || has_device_names || has_place_names) {
      for (var device of devices) {
        DeviceDataService.putWhere(where, DEVICE_NAME_FIELD, device.device_name)
      }
    }
    */

    if (params.every==null) params.every = '1d';

    var params_base = {
      organization_id: params.organization_id,
      domain_id: params.domain_id,
      device_type_category_name: params.device_type_category_name,
      device_type_name: params.device_type_name,
      where: params.where,
      timezone: params.timezone,
      start: params.start,
      stop: params.stop,
      every: params.every,
      time_src: params.time_src,
      group_by: '!DeviceName,_field',
      create_empty: true,
      pivot_columns: '_field'
    }

    /*
    var w = await this.filterDevice(params_base)
    if (w==null) return []
    var organization_name = w.organization.domain_name
    params_base.where = JSON.stringify(w.where)
    */

    /*
    var device_output_name = params.device_output_name
    if (device_output_name==null) {
      var device_outputs = await this.deviceOutputService.findAll()
      if (device_outputs.length==0) {
        return []
      }
      device_output_name = device_outputs.map(x=>x.device_output_name).join(',')
    }
    */

    var params_energy = Object.assign({
      device_output_name: 'hermes_pv_inverter_data', //w.device_output_names,
      //fields: 'LoadEnergy,SolarEnergy,GridEnergy',
      fields: 'SolarEnergy',
      differenceNonNegativeSource: 'true',
      time_function: 'sum',
      group_function: 'sum'
    }, params_base)


    var params_irradiance = Object.assign({
      device_output_name: 'hermes_pv_inverter_data', //w.device_output_names,
      fields: 'Irradiance',
      time_function: 'integral',
      group_function: 'sum'
    }, params_base)


    /*
    var params_solar_prediction = Object.assign({
      device_output_name: 'solar_prediction',
      fields: 'SolarPower',
      time_function: 'sum',
      group_function: 'sum'
    }, params_base)
    */

    var params_device_spec = Object.assign({
      device_output_name: 'device_spec',
      fields: 'SolarCapacity',
      time_function: 'first',
      group_function: 'sum'
    }, params_base)


    //var table_solar_prediction = await this.queryInflux(organization_name, params_solar_prediction.device_output_name, params_solar_prediction, null);
  //  var table_energy = await this.queryInflux(organization_name, params_energy.device_output_name, params_energy, null);
  //  var table_irradiance = await this.queryInflux(organization_name, params_irradiance.device_output_name, params_irradiance, null);
  //  var table_device_spec = await this.queryInflux(organization_name, params_device_spec.device_output_name, params_device_spec, null);

    var table_energy = await this.query(this_user, params_energy);
    var table_irradiance = await this.query(this_user, params_irradiance);
    var table_device_spec = await this.query(this_user, params_device_spec);

    var now = Date.now()
    for (var irr of table_irradiance) {
      if ((new Date(irr._time)).getTime()>now && irr.Irradiance==0) irr.Irradiance=null;
    }

    /*
    var every = params.every
    var every_num = parseInt(every)
    var is_every_mo = false
    var every_sec = 60*60
    if (every.substring(every.length-2, every.length)=='mo') {
      is_every_mo = true
    } else if (every.substring(every.length-1, every.length)=='d') {
      every_sec = 60 * 60 * 24 * every_num
    } else if (every.substring(every.length-1, every.length)=='h') {
      every_sec = 60 * 60 * every_num
    } else if (every.substring(every.length-1, every.length)=='m') {
      every_sec = 60 * every_num
    } else if (every.substring(every.length-1, every.length)=='s') {
      every_sec = every_num
    }
    */

    var timezone = params.timezone
    if (timezone==null) {
      timezone = 'Asia/Taipei'
    }

    var rets = []
    var size = table_energy.length
    for (var n=0; n<size; n++) {
      /*
      if (is_every_mo) {
        var m = moment.tz(table_energy[n]._time, timezone);
        m.subtract(1, 'months')
        every_sec = 60 * 60 * 24 * m.daysInMonth() * every_num
      }
      */
      var ret = {
        _time: table_energy[n]?._time,
        SolarEnergy: table_energy[n]?.SolarEnergy,
        SolarCapacity: table_device_spec[n]?.SolarCapacity, // 100
        Irradiance: (table_irradiance[n]?.Irradiance==null) ? undefined : table_irradiance[n]?.Irradiance / 60 / 60,  // 35000000
        PR: undefined
      }
      if (
        ret.SolarEnergy != null &&
        ret.SolarCapacity != null &&
        ret.Irradiance != null
      ) {
        var production_yield = ret.SolarEnergy / ret.SolarCapacity
        var irradiation_yield = ret.Irradiance / 1000
        ret.PR = production_yield / irradiation_yield * 100
      }
      rets.push(ret)
    }

    return rets;

  }


  // 解析代码并生成 AST
  static addVarPrefix(inputCode, prefix='') {
    // 使用 acorn 解析代码为抽象语法树
    const ast = acorn.parse(inputCode, { ecmaVersion: 'latest' });

    // 遍历 AST，修改所有的变量名
    function transformNode(node) {
      if (node.type === 'Identifier') {
        // 如果是变量名，修改其值
        node.name = prefix + node.name;
      } else if (node.type === 'Literal' && typeof node.value === 'number' && Number.isInteger(node.value)) {
        // 如果是整数常量，加上 ".0"
        node.value = node.value + 0.0;
      }
    }

    // 深度遍历 AST，并修改节点
    function traverseAst(node) {
      transformNode(node);

      // 对所有子节点递归进行相同的操作
      for (const key in node) {
        if (node[key] && typeof node[key] === 'object') {
          Array.isArray(node[key])
            ? node[key].forEach(traverseAst)
            : traverseAst(node[key]);
        }
      }
    }

    // 开始遍历 AST
    traverseAst(ast);

    // 使用 escodegen 将修改后的 AST 转回代码
    var transformedCode = escodegen.generate(ast);
    if (transformedCode.charAt(transformedCode.length-1)==';') {
      transformedCode = transformedCode.substring(0, transformedCode.length-1)
    }
    return transformedCode;
  }

  async queryDomain(this_user:UserWithPermission, param, res=null) {
    if (param==null) {
      throw new HttpException('param is needed', HttpStatus.BAD_REQUEST);
    }

    param.pivot_columns = '_field'
    //if (param.time_function==null) param.time_function = 'mean';

    var timezone2 = param.timezone ?? 'Asia/Taipei'
    if (''+param.stop_align_every=='true' && param.every!=null) {
      let stop2 = Util.getRelativeTime(param.stop, timezone2)
      param.stop = Util.alignTime(stop2, param.every, timezone2)
    }

    if (param.organization_id==null) {
      throw new HttpException('organization_id is needed', HttpStatus.BAD_REQUEST);
    }
    var organization = await this.domainService.findOne(this_user, param.organization_id)
    if (organization==null) {
      throw new HttpException('organization(domain) not found', HttpStatus.NOT_FOUND);
    }

    var domain_id = param.domain_id

    if (domain_id==null) {
      throw new HttpException('"domain_id" is invalid', HttpStatus.BAD_REQUEST);
    }
    var domain:Domain = await this.domainService.findOne(this_user, domain_id)
    if (domain==null) {
      throw new HttpException('Domain not found', HttpStatus.NOT_FOUND);
    }

    var result = await this.queryDomainRecursion(this_user, param, res, organization, domain)
    if (result.last_qname!=null) result.flux += '\n' + result.last_qname
    if (result.flux!='') result.flux += '\n' + '|> group()'

    console.log('last_qname='+result.last_qname);
    console.log(result.flux.replaceAll('|>', '\n|>'));

    var root_param = Object.assign({}, param)
    root_param.import_join = 'true'
    delete root_param.every
    delete root_param.time_function
    delete root_param.pivot_columns

    var ret = await this.queryInfluxMultiSource(organization.domain_name, result.flux, root_param, res)
    return ret
  }

  async queryDomainToday(this_user:UserWithPermission, param) {

    if (param.domain_id==null) {
      throw new HttpException('"domain_id" is invalid', HttpStatus.BAD_REQUEST);
    }
    var domain = await this.domainService.findOne(this_user, param.domain_id)
    if (domain==null) {
      throw new HttpException('Domain not found', HttpStatus.NOT_FOUND);
    }
    var organization_id = await this.domainService.getOrganizationId(param.domain_id)

    var timezone = param.timezone
    if (timezone==null) timezone = 'Asia/Taipei'
    var m = moment.tz((new Date()).toISOString(), timezone);

    var param_base = {
      organization_id,
      domain_id: param.domain_id,
      timezone: param.timezone,
      start: m.startOf('day').toISOString(),
      every: '1d',
      time_src: '_start'
    }

    // SolarEnergy,LoadEnergy,GridPurchaseEnergy,GridSellEnergy,BatteryDischargeEnergy,BatteryChargeEnergy

    var ret:any = {}

    var param2 = Object.assign({"fields": "SolarEnergy,LoadEnergy"}, param_base)
    var data = await this.queryDomain(this_user, param2, null);
    if (data.length>0) {
      var last_index = data.length-1
      ret.SolarEnergy = data[last_index].SolarEnergy
      ret.LoadEnergy = data[last_index].LoadEnergy
    }

    var param2 = Object.assign({"fields": "GridPurchaseEnergy,GridSellEnergy"}, param_base)
    var data = await this.queryDomain(this_user, param2, null);
    if (data.length>0) {
      var last_index = data.length-1
      ret.GridPurchaseEnergy = data[last_index].GridPurchaseEnergy
      ret.GridSellEnergy = data[last_index].GridSellEnergy
    }

    var param2 = Object.assign({"fields": "BatteryDischargeEnergy,BatteryChargeEnergy"}, param_base)
    var data = await this.queryDomain(this_user, param2, null);
    if (data.length>0) {
      var last_index = data.length-1
      ret.BatteryDischargeEnergy = data[last_index].BatteryDischargeEnergy
      ret.BatteryChargeEnergy = data[last_index].BatteryChargeEnergy
    }
    
    return ret;
  }


  async queryDomainRecursion(this_user:UserWithPermission, param, res, organization, domain) {

    var self = this

    function getMapVars(map):Set<string> {
      var map_vars = new Set<string>()
      if (map==null) return map_vars;
      if (!(/[A-Za-z0-9\_]+/.test(map.field))) {
        throw new HttpException('"domain('+domain?.domain_name+').data_sources". map.field is invalid.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      if (!(/[A-Za-z0-9\_\+\-\*\/\.\(\) ]+/.test(map.value))) {
        throw new HttpException('"domain('+domain?.domain_name+').data_sources". map.value is invalid.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      if (!Util.checkParenthesesBalance(map.value)) {
        throw new HttpException('"domain('+domain?.domain_name+').data_sources". map.value is invalid. Asymmetrical brackets.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      var vars:string[] = RecordConverter.getUndefinedVars(map.value);
      for (var v of vars) {
        if (v=='r') continue;
        if (v.substring(0,2)=='r.') {
          v = v.substring(2,v.length)
        }
        map_vars.add(v)
      }
      return map_vars
    }

    function getMapsVars(maps):Set<string> {
      var map_vars = new Set<string>()
      for (let map of maps) {
        map_vars = Util.unionSet(map_vars, getMapVars(map))
      }
      return map_vars
    }

    function buildTree(query):Set<string> {

      var exports:Set<string> = new Set()

      var child_querys = query.querys
      if (Array.isArray(child_querys)) {
        for (var child_query of child_querys) {
          var child_exports = buildTree(child_query)
          exports = Util.unionSet(exports, child_exports)
        }
      }

      if (Array.isArray(query.sources)) {
        for (let source of query.sources) {
          if (typeof(source.fields)=='string') {
            var fields = source.fields.split(',')
            for (var field of fields) {
              var field_arr = field.split(':')
              var field_new_name = field_arr[field_arr.length-1]
              exports.add(field_new_name)
            }
          }
        }
      }

      if (Array.isArray(query.maps)) {
        for (let map of query.maps) {
          exports.add(map.field)
          map.need_fields = getMapVars(map)
        }
      }

      if (typeof(query.export_fields)=="string") {
        query.export_fields_set = new Set(query.export_fields.split(','))
      } else {
        query.export_fields_set = exports
      }
      return query.export_fields_set
    }


    async function getFlux(query, param_fields, param, query_ref, all_device_names):Promise<{ last_qname?: string; flux?: string; }> {
      
      
      async function getFluxBySources(query, need_fields:Set<string>) {

        let match_fields:Set<string> = new Set()

        var ret = {
          last_qname: null,
          flux: '',
          fields: []
        }

        var sources = query.sources
        if (!Array.isArray(sources)) {
          return ret
        }

        var query_sources = []
        for (let source of sources) {

          if (typeof(source.fields)!='string') continue;
          var fields = source.fields.split(',')
          let both_fields:Set<string> = new Set()
          for (var field of fields) {
            var field_arr = field.split(':')
            var field_new_name = field_arr[field_arr.length-1]
            if (need_fields.has(field_new_name)) {
              both_fields.add(field)
              match_fields.add(field_new_name)
            }
          }
          if (both_fields.size==0) continue;

          var device_names = source.device_names.split(',')
          var where = {}
          var has_device = false
          for (var device_name of device_names) {
            if (all_device_names==null || all_device_names.indexOf(device_name)!=-1) {
              has_device = true
              DeviceDataService.putWhere(where, AppConfigService.DEVICE_NAME_FIELD, device_name)
            }
          }
          if (device_names.length==0 || (device_names.length>0 && has_device)) {
            query_sources.push({
              measurement: source.device_output_name,
              where: JSON.stringify(where),
              fields: Array.from(both_fields).join(',')
            })
          }
        }

        if (query_sources.length>0) {

          var query_param:any = {
            differenceNonNegativeSource: query.differenceNonNegativeSource,
            time_function: query.time_function,
            time_function_params: query.time_function_params
          }

          for (var n3 in param) {
            if (param[n3]!=null) query_param[n3] = param[n3];
          }

          Object.assign(query_param, {
          //  differenceNonNegativeSource: query.differenceNonNegativeSource,
          //  time_function: query.time_function,
          //  time_function_params: query.time_function_params,
          //  group_by: "!DeviceName,_field",
          //  group_function: query.group_function,
            group_by: "DeviceName,_field",
            group_function: null,
          //  maps: (query.maps==null)?null:JSON.stringify(query.maps),
            output_format: 'influx_query',
            has_import: false,
            has_limit: false,
            no_output: true
          })

          if (query_param.time_function==null) query_param.time_function = 'mean';

          if (query.group_function!=null && query.maps==null) {
            query_param.group_by = "!DeviceName,_field"
            query_param.group_function = query.group_function
          }

          delete query_param.output_zip
          delete query_param.debug
          delete query_param.limit

          let influx_query = await self.queryInfluxMultiSource(organization.domain_name, query_sources, query_param)
          ret = {
            last_qname: influx_query.last_qname,
            flux: influx_query.flux,
            fields: Array.from(match_fields)
          }
        }

        return ret
      }

      async function getFluxByQuerys(query, need_fields:Set<string>, influx_querys) {
        var found = false
        if (Array.isArray(query.querys)) {
          for (var child_query of query.querys) {
            var both_fields:Set<string> = Util.intersectionSet(need_fields, child_query.export_fields_set)
            if (both_fields.size>0) {
              found = true
              var r = await getFlux(child_query, Array.from(both_fields), param, query_ref, all_device_names)
              influx_querys.push({
                last_qname: r.last_qname,
                flux: r.flux,
                fields: both_fields
              })
              for (var both_field of both_fields) {
                need_fields.delete(both_field);
              }
            }
          }
        }
        return found
      }

      async function getFluxByMaps(query, need_fields:Set<string>, influx_querys) {
        var found = false

        if (!Array.isArray(query.maps)) return;

        for (var map of query.maps) {
          if (typeof(map.field)!='string') continue;
          if (!need_fields.has(map.field)) continue;
          need_fields.delete(map.field)

          let match_fields:Set<string> = new Set(map.need_fields)

          found = found || await getFluxByQuerys(query, match_fields, influx_querys)

          var influx_query = await getFluxBySources(query, match_fields)
          if (influx_query.fields.length>0) {
            found = true
            influx_querys.push({
              last_qname: influx_query.last_qname,
              flux: influx_query.flux,
              fields: influx_query.fields
            })
            match_fields = Util.differenceSet(match_fields, influx_query.fields)
          }

          found = found || await getFluxByQuerys(query_ref, match_fields, influx_querys)

        }
        if (found) {
          let flux2 = `|> map(fn: (r) => ({r with ${map.field}: ${map.value}}))`
          influx_querys.push({
            is_map: true,
            flux: flux2
          })
        }
      }

      var need_fields:Set<string> = new Set(param_fields)
      var match_fields = new Set([...need_fields])
      var influx_querys = []

      if (Array.isArray(query.querys)) {
        for (var child_query of query.querys) {
          var both_fields:Set<string> = Util.intersectionSet(match_fields, child_query.export_fields_set)
          if (both_fields.size>0) {
            var r = await getFlux(child_query, Array.from(both_fields), param, query_ref, all_device_names)
            influx_querys.push({
              last_qname: r.last_qname,
              flux: r.flux,
              fields: Array.from(both_fields)
            })
            match_fields = Util.differenceSet(match_fields, both_fields)
          }
        }
      }

      await getFluxByMaps(query, match_fields, influx_querys)

      var influx_query = await getFluxBySources(query, match_fields)
      if (influx_query.fields.length>0) {
        influx_querys.push({
          last_qname: influx_query.last_qname,
          flux: influx_query.flux,
          fields: influx_query.fields
        })
        match_fields = Util.differenceSet(match_fields, influx_query.fields)
      }

      var last_qname = null
      var flux = ''

      if (influx_querys.length>0) {
        if (influx_querys.length==1) {
          last_qname = influx_querys[0].last_qname
          flux = influx_querys[0].flux
        } else {
          var qnames = []
          var map_fluxs = []
          var influx_querys2 = []
          for (let influx_query of influx_querys) {
            if (influx_query.is_map) {
              map_fluxs.push(influx_query.flux)
            } else if (influx_query.last_qname==null) {
              last_qname = 'q' + Util.createRandomID()
              flux += '\n' + last_qname + '=' + influx_query.flux + '\n'
              influx_querys2.push(influx_query)
            } else {
              last_qname = influx_query.last_qname
              flux += '\n' + influx_query.flux + '\n'
              influx_querys2.push(influx_query)
            }
            qnames.push(last_qname)
          }

          //last_qname = 'q' + Util.createRandomID()
          //flux += last_qname + `=union(tables: [${qnames.join(',')}])` + '\n'
          
          function toKV(kvs, lr, fields) {
            for (var field of fields) {
              var field_arr = field.split(':')
              var new_field_name = field_arr[field_arr.length-1]
              kvs.push(new_field_name + ':' + lr + '.' + new_field_name)
            }
          }
          var prev_qname = null
          var prev_fields = new Set()
          if (qnames.length>0) {
            prev_qname = qnames[0]
            prev_fields = new Set([...influx_querys2[0].fields])
          }
          for (var n=1; n<influx_querys2.length; n++) {
            last_qname = 'q' + Util.createRandomID()
            var kvs = []
            toKV(kvs, 'l', prev_fields)
            toKV(kvs, 'r', influx_querys2[n].fields)
            flux += `
${last_qname}=join.full(
    left: ${prev_qname} |>group(columns:["_time"]),
    right: ${qnames[n]} |>group(columns:["_time"]),
    on: (l, r) => l._time == r._time,
    as: (l, r) => {
        time = if exists l._time then l._time else r._time
        return {_time: time, ${kvs.join(',')}}
    },
)`
            prev_qname = last_qname
            prev_fields = new Set([...prev_fields, ...influx_querys2[n].fields])
          }
          for (var map_flux of map_fluxs) {
            flux += map_flux
          }
        }
      }


      if ((query.maps!=null || query.querys!=null) && query.group_function == "sum") {
        flux += `|> group(columns: ["_time"])`
        var fns = []
        var ids = []
        for (let field of need_fields) {
          fns.push(`${field}: if exists r.${field} then accumulator.${field} + r.${field} else accumulator.${field}`)
          ids.push(`${field}: 0.0`)
        }
        flux += `
|> reduce(
  fn: (r, accumulator) =>
  ({
    ${fns.join(',')}
  }),
  identity: { ${ids.join(',')} },
)`
      }


      return {
        last_qname,
        flux
      }

    }

    var last_qname = null
    var influx_query_str = ''
    var domain_id = domain.domain_id

    if (param.fields==null || (''+param.fields).trim()=='') {
      throw new HttpException('"fields" is empty', HttpStatus.BAD_REQUEST);
    }
    var param_fields = param.fields.split(",")


    var child_domains = await this.domainService.findAll(this_user, {where:{parent_domain_id:domain_id}})
    var last_qnames = []
    for (var child_domain of child_domains) {
      var child_result = await this.queryDomainRecursion(this_user, param, res, organization, child_domain)
      if (child_result.flux!='') {
        influx_query_str += '\n' + child_result.flux + '\n'
        if (child_result.last_qname!=null) {
          last_qnames.push(child_result.last_qname)
        }
      }
      if (child_result.last_qname!=null) {
        last_qname = child_result.last_qname;
      }
    }
    if (last_qnames.length>=2) {
      last_qname = 'q' + Util.createRandomID()
      influx_query_str += last_qname + `=union(tables: [${last_qnames.join(',')}])` + '\n'
      influx_query_str += `|> group(columns: ["_field"])`
      influx_query_str += `|> sum()`
    }

    var domain_query = null
    if (!(domain.data_sources==null || (''+domain.data_sources).trim()=='')) {
      try {
        domain_query = JSON.parse(domain.data_sources)
      } catch (ex) {
        throw new HttpException(`"domain[${domain.domain_name}].data_sources" is invalid.` + ex, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    if (domain_query==null) {
      return {
        last_qname,
        flux: influx_query_str
      }
    }

    //domain_query = dsource
    buildTree(domain_query)
    
    var is_filter_device_type_category = (param.device_type_category_name!=null && (''+param.device_type_category_name).trim()!='')
    var is_filter_device_type = (param.device_type_name!=null && (''+param.device_type_name).trim()!='')

    var device_type_category_id = null
    if (is_filter_device_type_category) {
      var device_type_categorys = await this.deviceTypeCategoryService.findAll(this_user, {where:{device_type_category_name:param.device_type_category_name}})
      if (device_type_categorys.length==0) {
        throw new HttpException('DeviceTypeCategory not found', HttpStatus.NOT_FOUND);
      }
      device_type_category_id = device_type_categorys[0].device_type_category_id;
    }

    var device_type_id = null
    if (is_filter_device_type) {
      var device_types = await this.deviceTypeService.findAll(this_user, {where:{device_type_name:param.device_type_name}})
      if (device_types.length==0) {
        throw new HttpException('DeviceType not found', HttpStatus.NOT_FOUND);
      }
      device_type_id = device_types[0].device_type_id;
    }

    let devices:Device[] = null;
    if (is_filter_device_type_category && is_filter_device_type) {
      devices = await this.domainService.getAllDevices(this_user, this.deviceService, organization.domain_id, {device_type_category_id,device_type_id}, 1000000)
    } else if (is_filter_device_type_category) {
      devices = await this.domainService.getAllDevices(this_user, this.deviceService, organization.domain_id, {device_type_category_id}, 1000000)
    } else if (is_filter_device_type) {
      devices = await this.domainService.getAllDevices(this_user, this.deviceService, organization.domain_id, {device_type_id}, 1000000)
    }

    var all_device_names = null
    if (devices!=null) {
      all_device_names = devices.map(x=>x.device_name)
    }

    var r = await getFlux(domain_query, param_fields, param, domain_query, all_device_names)
    // r.flux += `|> map(fn: (r) => ({r with _domain_id: "${domain_id}"}))`


    return {
      last_qname: r.last_qname,
      flux: r.flux
    }
  }

}