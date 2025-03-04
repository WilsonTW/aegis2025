
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InfluxdbClientService } from './influxdb_client.service';
import { DomainService } from '../domain/domain.service';
import { DeviceTypeService } from '../device_type/device_type.service';
import { DeviceService } from '../device/device.service';
import { DeviceOutputService } from '../device_output/device_output.service';
import { EventService } from '../event/event.service';
import { AppService } from 'src/app.service';
import { Util } from 'src/util/util';
import { AppConfigService } from 'src/app_config.service';
import { DeviceDataService } from './device_data.service';
import { In, Repository } from 'typeorm';

import * as PDFDocument from 'pdfkit'
import { width } from 'pdfkit/js/page';
import { every } from 'rxjs';
import { UserWithPermission } from '../user/user_with_permission.entity';

const path = require('path');

const { registerFont, createCanvas } = require('canvas')

//const Chart = require('chart.js');
const Chart = require('chart.js/auto');
//import Chart from 'chart.js/auto';

const fs = require('fs');
//import moment from 'moment-timezone';
var moment = require('moment-timezone');
require('moment/locale/zh-tw');

const tmp = require('tmp');
var AdmZip = require("adm-zip");

//const font_path = path.join(__dirname, '..', '..', '..', 'public', 'font', 'Noto_Sans_TC', 'NotoSansTC-VariableFont_wght.ttf')
const font_path_medium = path.join(__dirname, '..', '..', '..', 'public', 'font', 'Noto_Sans_TC', 'static', 'NotoSansTC-Medium.ttf')
const font_path_regular = path.join(__dirname, '..', '..', '..', 'public', 'font', 'Noto_Sans_TC', 'static', 'NotoSansTC-Regular.ttf')
registerFont(font_path_regular, {family: 'Regular'});

@Injectable()
export class DeviceReportService {
  
  constructor(
    public readonly influxdbClientService:InfluxdbClientService,

    public readonly domainService: DomainService,
    public readonly domainServiceEx: DomainService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceService: DeviceService,
    public readonly deviceOutputService: DeviceOutputService,
    public readonly eventService: EventService,
    public readonly appService: AppService,

    public readonly deviceDataService: DeviceDataService,
  ) {
  }


  createProductionIrradiationChart(labels, production_values, irradiation_values) {
    const width = 1100;
    const height = 500;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Production(kWh)',
          data: production_values,
          borderColor: "#8DE0C2",
          backgroundColor: "#8DE0C2",
          yAxisID: 'y',
          order: 1
        },
        {
          label: 'Irradiation(Wh/m2)',
          data: irradiation_values,
          borderWidth: 4,
          borderColor: "#00A2FF",
          backgroundColor: "#00A2FF",
          yAxisID: 'y1',
          type: 'line',
          order: 0
        }
      ]
    };

    const config = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: 'Production(kWh) & Irradiation(Wh/m2)'
          },
          legend: {
            display: true,
            position: 'bottom'
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',

            // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          },
        }
      },
    };

    const chart = new Chart(ctx, config);

    // 将画布内容转换为 Base64 编码的 PNG 图像
    const base64Image = canvas.toDataURL('image/png').split(';base64,')[1];
    return base64Image;
  }


  createPRChart(labels, production_values, pr_values, pg_values, min, max) {
    const width = 1100;
    const height = 500;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Production(kWh)',
          data: production_values,
          borderColor: "#8DE0C2",
          backgroundColor: "#8DE0C2",
          yAxisID: 'y',
          order: 2
        },
        {
          label: 'Performance Ratio(%)',
          data: pr_values,
          borderWidth: 4,
          borderColor: "#00A2FF",
          backgroundColor: "#00A2FF",
          yAxisID: 'y1',
          type: 'line',
          order: 0
        },
        {
          label: 'Performance Guarantee (%)',
          data: pg_values,
          borderWidth: 4,
          borderColor: "#FF644E",
          backgroundColor: "#FF644E",
          yAxisID: 'y2',
          type: 'line',
          order: 1
        }
      ]
    };

    const config = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: false,
            text: ''
          },
          legend: {
            display: true,
            position: 'bottom'
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'kWh'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
            min: min,
            max: max,
            title: {
              display: true,
              text: '%'
            }
          },
          y2: {
            type: 'linear',
            display: false,
            position: 'right',
            // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
            min: min,
            max: max,
          },
        }
      },
    };

    const chart = new Chart(ctx, config);

    // 将画布内容转换为 Base64 编码的 PNG 图像
    const base64Image = canvas.toDataURL('image/png').split(';base64,')[1];
    return base64Image;
  }


  createEnergyChart(labels, load_energys, solar_energys, grid_energys, socs, min, max) {
    const width = 1100;
    const height = 500;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Solar Energy(kWh)',
          data: solar_energys,
          borderColor: "#B6F0A7",
          backgroundColor: "#B6F0A7",
          fill: true,
          yAxisID: 'y',
          type: 'bar',
          order: 2
        },
        {
          label: 'Load Energy(kWh)',
          data: load_energys,
          borderWidth: 4,
          borderColor: "#F3BCB8",
          backgroundColor: "#F3BCB8",
          fill: true,
          yAxisID: 'y',
          type: 'bar',
          order: 3
        },
        {
          label: 'Grid Energys(kWh)',
          data: grid_energys,
          borderWidth: 4,
          borderColor: "#CED0D5",
          backgroundColor: "#CED0D5",
          fill: true,
          yAxisID: 'y',
          type: 'bar',
          order: 4
        },
        {
          label: 'SoC(%)',
          data: socs,
          borderWidth: 4,
          borderColor: "#4073D7",
          backgroundColor: "#4073D7",
          yAxisID: 'y1',
          type: 'line',
          order: 1
        }
      ]
    };

    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: false,
            text: ''
          },
          legend: {
            display: true,
            position: 'bottom'
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'kWh'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
            min: min,
            max: max,
            title: {
              display: true,
              text: '%'
            }
          },
        }
      },
    };

    const chart = new Chart(ctx, config);

    // 将画布内容转换为 Base64 编码的 PNG 图像
    const base64Image = canvas.toDataURL('image/png').split(';base64,')[1];
    return base64Image;
  }


  createCurtailmentChart(labels, solar_energys, prediction_energys, curtailment_ratios) {
    const width = 1100;
    const height = 500;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Solar Energy(kWh)',
          data: solar_energys,
          borderColor: "#B6F0A7",
          backgroundColor: "#B6F0A7",
          fill: true,
          yAxisID: 'y',
          type: 'bar',
          order: 2
        },
        {
          label: 'Prediction Energy(kWh)',
          data: prediction_energys,
          borderWidth: 4,
          borderColor: "#91B889",
          backgroundColor: "#91B889",
          fill: true,
          yAxisID: 'y',
          type: 'bar',
          order: 3
        },
        {
          label: 'Curtailment Ratios(%)',
          data: curtailment_ratios,
          borderWidth: 4,
          borderColor: "#4073D7",
          backgroundColor: "#4073D7",
          yAxisID: 'y1',
          type: 'line',
          order: 1
        }
      ]
    };

    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: false,
            text: ''
          },
          legend: {
            display: true,
            position: 'bottom'
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'kWh'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
            min: 0,
            max: 100,
            title: {
              display: true,
              text: '%'
            }
          },
        }
      },
    };

    const chart = new Chart(ctx, config);

    // 将画布内容转换为 Base64 编码的 PNG 图像
    const base64Image = canvas.toDataURL('image/png').split(';base64,')[1];
    return base64Image;
  }


  toEnShortMonthName(month_number) {
    return moment().locale('en').month(month_number).format('MMM')
  }

  toShortMonthNameByTimezone(timezone, month_number) {
    // 建立一個在指定時區的時間
    const date = moment.tz({ year: 2023, month: month_number, day: 1 }, timezone);
    // 根據時區選擇適當的月份格式
    if (timezone === 'Asia/Taipei') {
        // 設置 locale 為中文繁體
        date.locale('zh-tw');
        return date.format('MMM'); // 返回中文月份簡稱
    } else {
        // 設置 locale 為預設的英文
        date.locale('en');
        return date.format('MMM'); // 返回英文月份簡稱
    }
  }



  static async sumPowerToEnergy(this_user:UserWithPermission, domainServiceEx:DomainService, deviceService, deviceDataService, organization_name, domain_id, field_name, start_time, stop_time, timezone, every, device_type_id=null) {
    var args = (device_type_id==null || (''+device_type_id).trim()=='') ? {} : {device_type_id: device_type_id}
    var device_names = [];
    var devices = await domainServiceEx.getAllDevices(this_user, deviceService, domain_id, args, 1000000);
    for (var device of devices) {
      //device_names.push(device.device_name)
      device_names.push(`r["${AppConfigService.DEVICE_NAME_FIELD}"]=="${device.device_name}"`)
    }

    var device_names_str = device_names.join(' or ');

    var fluxQuery = '';
    if (timezone!=null) {
      if (/[^a-zA-Z0-9\/]/.test(timezone)) {
        throw new HttpException('"timezone" is invalid', HttpStatus.BAD_REQUEST);
      }
      fluxQuery += `import "timezone"\n`;
      fluxQuery += `option location = timezone.location(name: "${timezone}")\n`;
    }
    fluxQuery += `
from(bucket: "${organization_name}")
|> range(start: ${start_time}, stop: ${stop_time})
|> filter(fn: (r) => r["_measurement"] == "hermes_report")
|> filter(fn: (r) => ${device_names_str})
|> filter(fn: (r) => r["_field"] == "${field_name}")
|> sort(columns: ["_time"])
|> map(fn: (r) => ({ r with _timeInt: uint(v: r._time) }))
|> difference(columns: ["_timeInt"])
|> map(fn: (r) => ({
_time: r._time,
_value: if exists r._timeInt then float(v: r._timeInt/1000000000) * r._value / (60.0*60.0) else 0.0
}))
`
    if (timezone!=null) {
      fluxQuery += `|> aggregateWindow(every: ${every}, fn: sum, createEmpty: true, location: location)`
    } else {
      fluxQuery += `|> aggregateWindow(every: ${every}, fn: sum, createEmpty: true)`
    }
    return await deviceDataService.queryByFlux(fluxQuery);
  }


  async generatePvPDF(this_user:UserWithPermission, time_type, domain_id, year:string|number, month:string|number=null, timezone='Asia/Taipei', device_type_id=null, fake_data:string|boolean='false'): Promise<Buffer> {
    var guarantee_capacity = 80;
    var device_type_name = 'pv_inverter';
    var self = this;
    var deviceDataService = this.deviceDataService;
    const pdfBuffer: Buffer = await new Promise(async (resolve, reject) => {
      try {

        if (!(time_type=='year' || time_type=='month')) {
          throw new HttpException('time_type is must in {"year", "month"}', HttpStatus.BAD_REQUEST);
        }

        if (domain_id==null || domain_id.trim()=='' || isNaN(parseInt(domain_id))) {
          throw new HttpException('domain_id is needed', HttpStatus.BAD_REQUEST);
        }

        if (year==null || (''+year).trim()=='' || (typeof(year)=='string' && isNaN(parseInt(year)))) {
          throw new HttpException('year is needed', HttpStatus.BAD_REQUEST);
        }
        year = parseInt(''+year);

        if (time_type=='month') {
          if (month==null || (''+month).trim()=='' || (typeof(month)=='string' && isNaN(parseInt(month)))) {
            throw new HttpException('month is invalid', HttpStatus.BAD_REQUEST);
          }
          month = parseInt(''+month);
          if (month<0 || month>11) {
            throw new HttpException('month is invalid. must be 0~11', HttpStatus.BAD_REQUEST);
          }
        } else {
          month = 0;
        }

        fake_data = (fake_data=='true' || fake_data=='1')

        if (timezone==null) timezone='Asia/Taipei'
        if (/[^a-zA-Z0-9\/]/.test(timezone)) {
          throw new HttpException('"timezone" is invalid', HttpStatus.BAD_REQUEST);
        }

        var data_count = 30;
        if (time_type=='year') {
          data_count = 12;
        } else if (time_type=='month') {
          var m = moment.tz({ year: year, month: month, day: 1 }, timezone);
          if (!m.isValid()) {
            throw new HttpException('Invalid date.', HttpStatus.BAD_REQUEST);
          }
          data_count = m.daysInMonth();
        }

        var domain = await this.domainService.findOne(this_user, domain_id);
        if (domain==null) {
          throw new HttpException('Domain not found.', HttpStatus.NOT_FOUND);
        }

        var organization_id = await this.domainService.getOrganizationId(domain_id);
        if (organization_id==null) {
          throw new HttpException('Organization of Domain not found.', HttpStatus.NOT_FOUND);
        }
        var organization = await this.domainService.findOne(this_user, organization_id);
        if (organization?.domain_name==null || organization.domain_name.trim()=='') {
          throw new HttpException('Organization name not found.', HttpStatus.NOT_FOUND);
        }
        var organization_name = organization.domain_name.trim()

        var device_types = await this.deviceTypeService.findAll(this_user, {where:{device_type_name:device_type_name}})
        if (device_types.length==0) {
          throw new HttpException('Device type('+device_type_name+') not found.', HttpStatus.NOT_FOUND);
        }
        var device_type = device_types[0]

        var args = (device_type_id==null || (''+device_type_id).trim()=='') ? {} : {device_type_id: device_type_id}
        var devices = await self.domainServiceEx.getAllDevices(this_user, self.deviceService, domain_id, args, 1000000);
        var capacity = 0;
        for (var device of devices) {
          capacity += (device.solar_capacity==null)?0:device.solar_capacity
        }

        var params_base = {
          organization_id: organization_id,
          device_type_name: device_type_name,
          device_output_name: 'hermes_report',
          domain_id: domain_id,
          timezone: timezone,
          group_function: 'sum'
        }

        async function getIntegrity(year:number, month:number) {
          var rets = [];
          var datas:any = [];
          var params_base2 = Object.assign({fields: 'SolarEnergy,Irradiance'}, params_base)
          var params = {}
          var m_start;
          if (time_type=='year') {
            m_start = moment.tz({ year: year, month: 0, day: 1 }, timezone);
            //var m_stop = moment.tz({ year: year, month: 12, day: 31, hour:23, minute:59, second:59}, timezone);
            var m_stop = moment.tz({ year: year+1, month: 0, day: 1 }, timezone);
            Object.assign(params, params_base2)
            Object.assign(params, {
              start: m_start.toISOString(),
              stop: m_stop.toISOString(),
              time_function: 'count',
              every: '1d',
              create_empty: true,
              group_by: '_field',
              group_function: 'sum',
              pivot_columns: '_field'
            })
            datas = await deviceDataService.query(this_user, params);
            for (var n=0; n<12; n++) {
              rets.push({count:0, ok:0})
            }
            for (var data of datas) {
              let m = moment.tz(data._time, timezone);
              var mo = m.month()
              rets[mo].count ++;
              if (data.SolarEnergy>0 && data.Irradiance>0) {
                rets[mo].ok ++;
              }
            }
          } else if (time_type=='month') {
            m_start = moment.tz({ year: year, month: month, day: 1 }, timezone);
            var daysInMonth = m_start.daysInMonth()
            //var m_stop = moment.tz({ year: year, month: 12, day: 31, hour:23, minute:59, second:59}, timezone);
            var m_stop = moment.tz({ year: year, month: month, day: 1 }, timezone);
            m_stop.add(1, 'months')
            Object.assign(params, params_base2)
            Object.assign(params, {
              start: m_start.toISOString(),
              stop: m_stop.toISOString(),
              time_function: 'count',
              every: '1h',
              create_empty: true,
              group_by: '_field',
              group_function: 'sum',
              pivot_columns: '_field'
            })
            datas = await deviceDataService.query(this_user, params);
            for (var n=0; n<daysInMonth; n++) { // rets[0] is the first day of month
              rets.push({count:0, ok:0})
            }
            for (var data of datas) {
              let m = moment.tz(data._time, timezone);
              var d = m.date() - 1
              rets[d].count ++;
              if (data.SolarEnergy>0 && data.Irradiance>0) {
                rets[d].ok ++;
              }
            }
          }
          return rets
        }

        /*
        async function getDiffEnergy(field_name, year:number, month:number) {
          var datas:any = [];
          var params_base2 = Object.assign({fields: field_name}, params_base)
          var params = {}
          var m_start;
          if (time_type=='year') {
            m_start = moment.tz({ year: year, month: 0, day: 1 }, timezone);
            m_start.subtract(1, 'months')
            //var m_stop = moment.tz({ year: year, month: 12, day: 31, hour:23, minute:59, second:59}, timezone);
            var m_stop = moment.tz({ year: year+1, month: 0, day: 1 }, timezone);
            Object.assign(params, params_base2)
            Object.assign(params, {
              start: m_start.toISOString(),
              stop: m_stop.toISOString(),
              time_function: 'last',
              every: '1mo',
              create_empty: true
            })
            datas = await deviceDataService.query(params);
          } else if (time_type=='month') {
            m_start = moment.tz({ year: year, month: month, day: 1 }, timezone);
            m_start.subtract(1, 'days')
            //var m_stop = moment.tz({ year: year, month: 12, day: 31, hour:23, minute:59, second:59}, timezone);
            var m_stop = moment.tz({ year: year, month: month, day: 1 }, timezone);
            m_stop.add(1, 'months')
            Object.assign(params, params_base2)
            Object.assign(params, {
              start: m_start.toISOString(),
              stop: m_stop.toISOString(),
              time_function: 'last',
              every: '1d',
              create_empty: true
            })
            datas = await deviceDataService.query(params);
          }

          if (datas.length>0 && datas[0]._value==null) {
            var param_first = Object.assign({}, params_base2)
            Object.assign(param_first, {
              start: 0,
              stop: m_stop.toISOString(),
              time_function: 'first'
            })
            var datas2:any = await deviceDataService.query(param_first);
            if (datas2.length>0) {
              var v = datas2[0]._value
              for (var n=0; n<datas.length-1; n++) {
                if (datas[n]._value==null && datas[n+1]._value!=null) {
                  datas[n]._value = v
                  break;
                }
              }
            }
          }

          for (var n=0; n<datas.length; n++) {
            datas[n]._diff = (n==0||datas[n]._value==null||datas[n-1]._value==null)?null:datas[n]._value-datas[n-1]._value
          }
          if (datas.length>0) datas.shift();
          return datas;
        }
        */


        var prs = null;
        var solar_energy_datas:any = [];
        var irradiance_datas:any = [];
        var integrity_datas:any = [];
        var m_start;
        var m_stop;
        if (time_type=='year') {
          m_start = moment.tz({ year: year, month: 0, day: 1 }, timezone);
          //m_start.subtract(1, 'months')
          m_stop = moment.tz({ year: year+1, month: 0, day: 1 }, timezone);
        } else if (time_type=='month') {
          m_start = moment.tz({ year: year, month: month, day: 1 }, timezone);
          //m_start.subtract(1, 'days')
          m_stop = moment.tz({ year: year, month: month, day: 1 }, timezone);
          m_stop.add(1, 'months')
        }
        if (!fake_data) {
          var params2 = {
            organization_id: organization_id,
            domain_id: domain_id,
            start: m_start.toISOString(),
            stop: m_stop.toISOString(),
            every: '1d',
            timezone: timezone
          }
          if (time_type=='year') {
            params2['every'] = '1mo'
          } else {
            params2['every'] = '1d'
          }
          prs = await this.deviceDataService.getPR(this_user, params2);
          integrity_datas = await getIntegrity(year, month)

          /*
          solar_energy_datas = await getDiffEnergy('SolarEnergy', year, month)
          let every = (time_type=='month')?'1d':'1mo'
          irradiance_datas = await DeviceReportService.sumPowerToEnergy(
            self.domainService, self.deviceService, self.deviceDataService,
            organization_name, domain_id, 'Irradiance', m_start.toISOString(), m_stop.toISOString(),
            timezone, every, device_type_id)
          integrity_datas = await getIntegrity(year, month)
          */
        }

        //var size = 30;
        var labels = [];
        var production_values = [];
        var irradiation_values = [];
        var production_sum = 0;
        var irradiation_sum = 0;
        var pr_values = [];
        var pg_values = [];
        var data_integrity_values = [];
        for (var n=0; n<data_count; n++) {
          var label = ''+(n+1);
          if (time_type=='year') {
            var m = moment.tz({ year: 2023, month: n, day: 1 }, timezone);
            m.locale('en');
            label = m.format('MMM');
          }
          labels.push(label);
          if (fake_data) {
            production_values.push(Math.floor(Math.random()*6000));
            irradiation_values.push(Math.floor(Math.random()*900));
            pr_values.push(70+Math.floor(Math.random()*20));
            data_integrity_values.push(95+Math.floor(Math.random()*5));
          } else {
            /*
            var solar_energy_data_diff = (solar_energy_datas[n]?._diff==null) ? null : Math.floor(solar_energy_datas[n]._diff)
            var irradiance_data_value = (irradiance_datas==null || irradiance_datas[n]?._value==null) ? null : Math.floor(irradiance_datas[n]._value)
            production_values.push(solar_energy_data_diff);
            irradiation_values.push(irradiance_data_value);
            var pr = null;
            if (solar_energy_data_diff!=null && irradiance_data_value!=null) {
              var production_yield = solar_energy_data_diff / capacity;
              var irradiation_yield = irradiance_data_value / 1000;
              pr = (irradiation_yield==0) ? null : production_yield / irradiation_yield * 100
            }
            pr_values.push(pr);
            */
            production_values.push(prs[n]?.SolarEnergy);
            irradiation_values.push(prs[n]?.Irradiance);
            pr_values.push(prs[n]?.PR);
            data_integrity_values.push(integrity_datas[n].ok/integrity_datas[n].count);
          }
          pg_values.push(guarantee_capacity);
          //data_integrity_values.push(95+Math.floor(Math.random()*5));
          //data_integrity_values.push(null);
          if (production_values[n]!=null) {
            production_sum += production_values[n]
          }
          if (irradiation_values[n]!=null) {
            irradiation_sum += irradiation_values[n]
          }
        }
        //var pr_total = (production_sum/capacity) / (irradiation_sum/1000) * 100
        var pr_total = Util.avg(pr_values)


        var fit_rate_str = '';
        var plant_income = 0;
        if (fake_data) {
          capacity = 196
          production_sum = 20416
          irradiation_sum = 130835
          pr_total = 79.65
          fit_rate_str = '4.1733';
          plant_income = 85202.09;
        } else {
          var generate_money = await this.getGenerateMoney(this_user, domain_id, device_type.device_type_id, m_start.toISOString(), m_stop.toISOString())
          var tariffs = [];
          for (var income of generate_money.incomes) {
            if (income.tariff!=null && tariffs.indexOf(income.tariff)==-1) tariffs.push(income.tariff)
          }
          var fit_rate_str = tariffs.join(', ');
          plant_income = generate_money.total_income
        }

        const doc = new PDFDocument({
          size: 'A4', // A4 (595.28 x 841.89)
          bufferPages: true,
        })

        doc.font(font_path_regular)
        //doc.font(font_path, 'Regular')

        const page_width = 595;
        const page_height = 841;
        const page_lr_margin = 20;

  /*
        doc.addPage({
          margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
          }
        });
  */

        const header_top = 50;
        const header_height = 40;
        const header_bottom = header_top+header_height;


        var logo_path = path.join(__dirname, '..', '..', '..', 'public', 'derui.png')
        doc.image(logo_path, page_width-page_lr_margin-100, 15, {
          fit: [100, 24],
          align: 'center',
          valign: 'center'
        });
        
        doc.lineWidth(1);
        doc.rect(page_lr_margin, header_top, page_width-page_lr_margin*2, 150);
        doc.stroke("#CCCCCC");

        doc.rect(page_lr_margin, header_top, page_width-page_lr_margin*2, header_height);
        //doc.fillAndStroke("#000", "#900")
        doc.fill("#093040")

        var logo_path2 = path.join(__dirname, '..', '..', '..', 'public', 'aegis.png')
        const logo2_height = 20;
        doc.image(logo_path2, page_lr_margin+10, header_top+(header_height-logo2_height)/2, {
          fit: [73, logo2_height],
          align: 'center',
          valign: 'center'
        });

        var report_range_name = (time_type=='year')?'Year':'Monthly'
        var report_time = (time_type=='year')?year:self.toEnShortMonthName(month)+'/'+year
        
      //  doc.font(font_path, 'Bold')
        doc.fontSize(12)
        doc.fillColor('#FFFFFF')
        doc.text(`${domain.domain_name} ${report_range_name} Report - ${report_time}`, 0, header_top+10, {width: page_width, align: 'center'});
        doc.text(`${Util.numberWithCommas(capacity)} kWp`, 0, header_top+10, {width: page_width-page_lr_margin-50, align: 'right'});

        const header_column_width1 = 150
        const header_column_width2 = 170
        const header_column_height = 30
        const header_column_pad_top = 15
        const header_column_pad_left = 10
        const header_value_left1 = page_lr_margin+header_column_width1+header_column_pad_left
        const header_value_left2 = page_lr_margin+header_column_width2+header_column_pad_left+280

      //  doc.font(font_path, 'Medium')
        doc.fontSize(12)
        doc.fillColor('#000000')
        doc.text(`Production (kWh):`, page_lr_margin+10, header_bottom+header_column_pad_top+header_column_height*0, {width: header_column_width1, align: 'center'});
        doc.text(`FIT rate (NTD):`, page_lr_margin+10, header_bottom+header_column_pad_top+header_column_height*1, {width: header_column_width1, align: 'center'});
        doc.text(`Plant Income (NTD):`, page_lr_margin+10, header_bottom+header_column_pad_top+header_column_height*2, {width: header_column_width1, align: 'center'});
        doc.text(`Irradiation (kWh/m2)):`, page_lr_margin+280, header_bottom+header_column_pad_top+header_column_height*0, {width: header_column_width2, align: 'center'});
        doc.text(`Performance Guarantee (%):`, page_lr_margin+280, header_bottom+header_column_pad_top+header_column_height*1, {width: header_column_width2, align: 'center'});
        doc.text(`Performance Ratio (%):`, page_lr_margin+280, header_bottom+header_column_pad_top+header_column_height*2, {width: header_column_width2, align: 'center'});

      //  doc.font(font_path, 'Thin')
        doc.fontSize(12)
        doc.fillColor('#000000')
        doc.text(`${Util.numberWithCommas(production_sum)}`, header_value_left1, header_bottom+header_column_pad_top+header_column_height*0, {width: header_column_width1, align: 'left'});
        doc.text(`${fit_rate_str}`, header_value_left1, header_bottom+header_column_pad_top+header_column_height*1, {width: header_column_width1, align: 'left'});
        doc.text(`${Util.numberWithCommas(plant_income)}`, header_value_left1, header_bottom+header_column_pad_top+header_column_height*2, {width: header_column_width1, align: 'left'});
        doc.text(`${Util.numberWithCommas(irradiation_sum)}`, header_value_left2, header_bottom+header_column_pad_top+header_column_height*0, {width: header_column_width2, align: 'left'});
        doc.text(`${Util.numberWithCommas(guarantee_capacity)}`, header_value_left2, header_bottom+header_column_pad_top+header_column_height*1, {width: header_column_width2, align: 'left'});
        doc.text(`${Util.numberWithCommas(pr_total!=null?Math.floor(pr_total*100)/100:'')}`, header_value_left2, header_bottom+header_column_pad_top+header_column_height*2, {width: header_column_width2, align: 'left'});

        var min = Math.min(...pr_values, ...pg_values)
        var max = Math.max(...pr_values, ...pg_values)

        var pad = 5;
        var min2 = (min-pad<0)?0:min-pad;
        var max2 = (max+pad>100)?100:max+pad;

        var base64Image = this.createProductionIrradiationChart(labels, production_values, irradiation_values);
        doc.image(Buffer.from(base64Image, 'base64'), page_lr_margin, 230, {
          fit: [550, 250],
          align: 'center',
          valign: 'center'
        });

        var base64Image = this.createPRChart(labels, production_values, pr_values, pg_values, min2, max2);
        doc.image(Buffer.from(base64Image, 'base64'), page_lr_margin, 500, {
          fit: [550, 250],
          align: 'center',
          valign: 'center'
        });

        doc.addPage({
          size:'A4'
        });

        const table_y0 = header_bottom;
        const column_count = 5;
        const cell_height = 20;
        const cell_width = Math.floor((page_width-page_lr_margin*2)/column_count);
        const text_size = 10;
        const cell_text_top = Math.floor(cell_height-text_size)/2-2

        // table header background
        doc.rect(page_lr_margin, table_y0, page_width-page_lr_margin*2, cell_height);
        doc.fill("#112741")

        // table colume 1 background
        doc.rect(page_lr_margin, table_y0+cell_height, cell_width, cell_height*(data_count+1));
        doc.fill("#EDEDED")

        // table footer background
        doc.rect(page_lr_margin+cell_width, table_y0+cell_height*(data_count+1), page_width-page_lr_margin*2-cell_width, cell_height);
        doc.fill("#D5D6D5")

        // draw vertical line
        for (var c=1; c<column_count; c++) {
          var x = page_lr_margin+c*cell_width;
          doc.lineCap('butt')
            .moveTo(x, table_y0)
            .lineTo(x, table_y0+(data_count+2)*cell_height)
            .stroke('#D3D3D3');
        }

        // draw horizontal line
        for (var n=1; n<data_count+1; n++) {
          var y = table_y0+(n+1)*cell_height
          doc.lineCap('butt')
            .moveTo(page_lr_margin, y)
            .lineTo(page_width-page_lr_margin, y)
            .stroke('#D3D3D3');
        }

        doc.fontSize(text_size)
        doc.fillColor('#FFFFFF')
        var y = table_y0+cell_text_top;
        doc.text(`Date`, page_lr_margin, y, {width: cell_width, align: 'center'});
        doc.text(`Irradiation(Wh/m2)`, page_lr_margin+cell_width, y, {width: cell_width, align: 'center'});
        doc.text(`Production(kWh)`, page_lr_margin+cell_width*2, y, {width: cell_width, align: 'center'});
        doc.text(`Performance Ratio(%)`, page_lr_margin+cell_width*3, y, {width: cell_width, align: 'center'});
        doc.text(`PR Data Integrity(%)`, page_lr_margin+cell_width*4, y, {width: cell_width, align: 'center'});

        doc.fillColor('#000000')
        var cell_width2 = cell_width - 10
        if (cell_width2<0) cell_width2=0;
        for (var n=0; n<data_count; n++) {
          var y = table_y0+(n+1)*cell_height+cell_text_top
          doc.text(labels[n], page_lr_margin, y, {width: cell_width, align: 'center'});
          doc.text(Util.numberWithCommas(irradiation_values[n]), page_lr_margin+cell_width, y, {width: cell_width2, align: 'right'});
          doc.text(Util.numberWithCommas(production_values[n]), page_lr_margin+cell_width*2, y, {width: cell_width2, align: 'right'});
          doc.text(Util.numberWithCommas(pr_values[n]!=null?Math.floor(pr_values[n]*100)/100:null), page_lr_margin+cell_width*3, y, {width: cell_width2, align: 'right'});
          doc.text(Util.numberWithCommas(data_integrity_values[n]!=null?data_integrity_values[n]*100:null), page_lr_margin+cell_width*4, y, {width: cell_width2, align: 'right'});
        }

        var y = table_y0+(data_count+1)*cell_height+cell_text_top
        doc.text('Total', page_lr_margin, y, {width: cell_width, align: 'center'});
        doc.text(Util.numberWithCommas(irradiation_values.reduce((a,b)=>a+b)), page_lr_margin+cell_width, y, {width: cell_width2, align: 'right'});
        doc.text(Util.numberWithCommas(production_values.reduce((a,b)=>a+b)), page_lr_margin+cell_width*2, y, {width: cell_width2, align: 'right'});
        var mean_pr = pr_total!=null?Math.floor(pr_total*100)/100:null
        doc.text(Util.numberWithCommas(mean_pr), page_lr_margin+cell_width*3, y, {width: cell_width2, align: 'right'});
        var mean_integrity_values = Math.floor(data_integrity_values.reduce((a,b)=>a+b)/data_integrity_values.length*10000)/100
        doc.text(Util.numberWithCommas(mean_integrity_values), page_lr_margin+cell_width*4, y, {width: cell_width2, align: 'right'});

        doc.end()

        const buffer = []
        doc.on('data', buffer.push.bind(buffer))
        doc.on('end', () => {
          const data = Buffer.concat(buffer)
          resolve(data)
        })
      } catch (ex) {
        reject(ex)
        return;
      }
    })

    return pdfBuffer
  }



  async generateEssPDF(this_user:UserWithPermission, time_type, domain_id, year:string|number, month:string|number=null, timezone='Asia/Taipei', device_type_id=null, fake_data:string|boolean='false'): Promise<Buffer> {

    const page_width = 595;
    const page_height = 841;
    const page_lr_margin = 20;
    const content_width = page_width-page_lr_margin*2

    function drawPageHeader(doc, header_height) {
      let page_lr_margin = 0
      let header_top = 0
      doc.lineWidth(1);
      //doc.rect(page_lr_margin, header_top, page_width-page_lr_margin*2, 300);
      //doc.stroke("#CCCCCC");

      doc.rect(page_lr_margin, header_top, page_width-page_lr_margin*2, header_height);
      //doc.fillAndStroke("#000", "#900")
      doc.fill("#093040")

      var logo_path2 = path.join(__dirname, '..', '..', '..', 'public', 'aegis.png')
      const logo2_height = 20;
      doc.image(logo_path2, page_lr_margin+10, header_top+(header_height-logo2_height)/2, {
        fit: [73, logo2_height],
        align: 'center',
        valign: 'center'
      });

      var report_range_name = (time_type=='year')?'Year':'Monthly'
      var report_time = (time_type=='year')?year:self.toEnShortMonthName(month)+'/'+year
      
      //  doc.font(font_path, 'Bold')
      doc.fontSize(12)
      doc.fillColor('#FFFFFF')
      doc.text(`${report_range_name} Report - ${report_time}`, 0, header_top+10, {width: page_width, align: 'center'});
      //  doc.text(`${Util.numberWithCommas(bat_capacity)} kWh`, 0, header_top+10, {width: page_width-page_lr_margin-50, align: 'right'});
    }


    //var device_type_name = 'pomcube';
    var self = this;
    const pdfBuffer: Buffer = await new Promise(async (resolve, reject) => {
      try {

        if (!(time_type=='year' || time_type=='month')) {
          throw new HttpException('time_type is must in {"year", "month"}', HttpStatus.BAD_REQUEST);
        }

        if (domain_id==null || domain_id.trim()=='' || isNaN(parseInt(domain_id))) {
          throw new HttpException('domain_id is needed', HttpStatus.BAD_REQUEST);
        }

        if (year==null || (''+year).trim()=='' || (typeof(year)=='string' && isNaN(parseInt(year)))) {
          throw new HttpException('year is needed', HttpStatus.BAD_REQUEST);
        }
        year = parseInt(''+year);

        if (time_type=='month') {
          if (month==null || (''+month).trim()=='' || (typeof(month)=='string' && isNaN(parseInt(month)))) {
            throw new HttpException('month is invalid', HttpStatus.BAD_REQUEST);
          }
          month = parseInt(''+month);
          if (month<0 || month>11) {
            throw new HttpException('month is invalid. must be 0~11', HttpStatus.BAD_REQUEST);
          }
        } else {
          month = 0;
        }

        fake_data = (fake_data=='true' || fake_data=='1')

        if (timezone==null) timezone='Asia/Taipei'
        if (/[^a-zA-Z0-9\/]/.test(timezone)) {
          throw new HttpException('"timezone" is invalid', HttpStatus.BAD_REQUEST);
        }

        var data_count = 30;
        if (time_type=='year') {
          data_count = 12;
        } else if (time_type=='month') {
          var m = moment.tz({ year: year, month: month, day: 1 }, timezone);
          if (!m.isValid()) {
            throw new HttpException('Invalid date.', HttpStatus.BAD_REQUEST);
          }
          data_count = m.daysInMonth();
        }

        var domain = await this.domainService.findOne(this_user, domain_id);
        if (domain==null) {
          throw new HttpException('Domain not found.', HttpStatus.NOT_FOUND);
        }

        var organization_id = await this.domainService.getOrganizationId(domain_id);
        if (organization_id==null) {
          throw new HttpException('Organization of Domain not found.', HttpStatus.NOT_FOUND);
        }
        var organization = await this.domainService.findOne(this_user, organization_id);
        if (organization?.domain_name==null || organization.domain_name.trim()=='') {
          throw new HttpException('Organization name not found.', HttpStatus.NOT_FOUND);
        }
        var organization_name = organization.domain_name.trim()

        var device_type_name = null
        var device_types = await this.deviceTypeService.findAll(this_user)
        if (device_type_id!=null) {
          var device_type = device_types.find(x=>x.device_type_id==device_type_id)
          if (device_type==null) {
            throw new HttpException('device_type_id ('+device_type_id+') not found.', HttpStatus.NOT_FOUND);
          }
          device_type_name = device_type.device_type_name
        }

        var args = (device_type_id==null || (''+device_type_id).trim()=='') ? {} : {device_type_id: device_type_id}
        var devices = await self.domainServiceEx.getAllDevices(this_user, self.deviceService, domain_id, args, 1000000);
        var solar_capacity = 0;
        var bat_capacity = 0;
        var solar_area = 0;
        for (var device of devices) {
          solar_capacity += (device.solar_capacity==null)?0:device.solar_capacity
          bat_capacity += (device.bat_capacity==null)?0:device.bat_capacity
          solar_area += (device.solar_area==null)?0:device.solar_area
        }


        var m_start;
        var m_stop;
        if (time_type=='year') {
          m_start = moment.tz({ year: year, month: 0, day: 1 }, timezone);
          //m_start.subtract(1, 'months')
          m_stop = moment.tz({ year: year+1, month: 0, day: 1 }, timezone);
        } else if (time_type=='month') {
          m_start = moment.tz({ year: year, month: month, day: 1 }, timezone);
          //m_start.subtract(1, 'days')
          m_stop = moment.tz({ year: year, month: month, day: 1 }, timezone);
          m_stop.add(1, 'months')
        }

        var table_energy;
        var table_soc;
        var table_solar_prediction;

        if (!fake_data) {

          var params_base = {
            organization_id: organization_id,
            device_type_name: device_type_name,
            domain_id: domain_id,
            timezone: timezone,
            start: m_start.toISOString(),
            stop: m_stop.toISOString(),
            group_by: '!DeviceName,_field',
            create_empty: true,
            pivot_columns: '_field'
          }

          if (time_type=='year') {
            params_base['every'] = '1mo'
          } else if (time_type=='month') {
            params_base['every'] = '1d'
          }

          var device_output_name = null;
          if (device_type_name=='pomcube') {
            device_output_name = 'pomcube_data'
          } else if (device_type_name=='pv_inverter') {
            device_output_name = 'hermes_report'
          }

          var params_energy = Object.assign({
            device_output_name: device_output_name,
            fields: 'LoadEnergy,SolarEnergy,GridEnergy',
            differenceNonNegativeSource: true,
            time_function: 'sum',
            group_function: 'sum'
          }, params_base)

          var params_soc = Object.assign({
            device_output_name: device_output_name,
            fields: 'BatSoC',
            time_function: 'mean',
            group_function: 'mean'
          }, params_base)

          var params_solar_prediction = Object.assign({
            device_output_name: 'solar_prediction',
            fields: 'DirectRadiation,SolarPower',
            time_function: 'sum',
            group_function: 'sum'
          }, params_base)

          table_energy = await this.deviceDataService.query(this_user, params_energy)
          table_soc = await this.deviceDataService.query(this_user, params_soc)
          table_solar_prediction = await this.deviceDataService.query(this_user, params_solar_prediction)
        }


        var load_energys = []
        var solar_energys = []
        var grid_energys = []
        var socs = []
        var prediction_energys = []
        var curtailment_ratios = []

        var labels = [];
        for (var n=0; n<data_count; n++) {
          var label = ''+(n+1);
          if (time_type=='year') {
            var m = moment.tz({ year: 2023, month: n, day: 1 }, timezone);
            m.locale('en');
            label = m.format('MMM');
          }
          labels.push(label);

          if (n<table_energy.length) {
            load_energys.push((table_energy[n].LoadEnergy==null) ? null : -table_energy[n].LoadEnergy)
            solar_energys.push(table_energy[n].SolarEnergy)
            grid_energys.push(table_energy[n].GridEnergy)
            socs.push(table_soc[n].BatSoC)
            var prediction_energy = table_solar_prediction[n].SolarPower==null ? null : table_solar_prediction[n].SolarPower/4/1000
            prediction_energys.push(prediction_energy)
            var curtailment_ratio = (prediction_energy!=null && table_energy[n].SolarEnergy!=null) ? (1-(table_energy[n].SolarEnergy/prediction_energy))*100 : null
            if (curtailment_ratio!=null) {
              if (curtailment_ratio>100) curtailment_ratio = 100;
              if (curtailment_ratio<0) curtailment_ratio = 0;
            }
            curtailment_ratios.push(curtailment_ratio)
          } else {
            load_energys.push(null)
            solar_energys.push(null)
            grid_energys.push(null)
            socs.push(null)
            prediction_energys.push(null)
            curtailment_ratios.push(null)
          }
        }

        const doc = new PDFDocument({
          size: 'A4', // A4 (595.28 x 841.89)
          bufferPages: true,
        })

        //var font_path = path.join(__dirname, '..', '..', '..', 'public', 'font', 'Noto_Sans_TC', 'NotoSansTC-VariableFont_wght.ttf')
        var font_path_medium = path.join(__dirname, '..', '..', '..', 'public', 'font', 'Noto_Sans_TC', 'static', 'NotoSansTC-Medium.ttf')
        var font_path_regular = path.join(__dirname, '..', '..', '..', 'public', 'font', 'Noto_Sans_TC', 'static', 'NotoSansTC-Regular.ttf')

        doc.font(font_path_regular)
        //doc.font(font_path, 'Regular')

  /*
        doc.addPage({
          margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
          }
        });
  */

        var yy = 0;
        const header_top = 0;
        const header_height = 40;
        var header_bottom = header_top+header_height;


        /*
        var logo_path = path.join(__dirname, '..', '..', '..', 'public', 'derui.png')
        doc.image(logo_path, page_width-page_lr_margin-100, 15, {
          fit: [100, 24],
          align: 'center',
          valign: 'center'
        });
        */
        

        drawPageHeader(doc, header_height);
        yy += header_height
        yy += 12

        var m = moment.tz({}, timezone);

        //  doc.font(font_path, 'Bold')
        doc.fontSize(12)
        doc.fillColor('#000000')
        doc.text(`Site Name : ${domain.domain_name}`, page_lr_margin, yy);
        doc.text(`Report Generation Date : ${m.format('MM-DD-YYYY HH:mm:ss')}`, page_lr_margin + content_width/2, yy, {width: content_width/2, align: 'left'});
        yy += 24

        doc.text(`Coordinates: ${domain.lat}° N, ${domain.lng}° E`, page_lr_margin, yy);
        yy += 32
        
        doc.fontSize(18)
        doc.text(`Overview`, page_lr_margin, yy);
        yy += 30

        var line_height = 20
        var c1_name_left = page_lr_margin + 10
        var c1_value_left = page_lr_margin + 160
        var content_width_div2 = content_width/2
        var c2_name_left = page_lr_margin + content_width/2 + 10
        var c2_value_left = page_lr_margin + content_width/2 + 160
        var overview_title_color = '#707070'

        var hh = 28
        doc.lineWidth(1);
        doc.rect(page_lr_margin, yy, content_width, hh);
        doc.fillAndStroke(overview_title_color, overview_title_color)
        doc.fontSize(12)
        doc.fillColor('#FFFFFF')
        doc.text(`Solar System`, c1_name_left, yy+4);
        doc.text(`Carbon Emission Reduction`, c2_name_left, yy+4);
        yy += hh
  
        hh = 64
        doc.rect(page_lr_margin, yy, content_width/2, hh);
        doc.rect(page_lr_margin+content_width/2, yy, content_width/2, hh);
        doc.stroke("#CCCCCC");
        doc.fontSize(12)
        doc.fillColor('#000000')
        var yy2 = yy + 10
        doc.text(`Solar Panel Area :`, c1_name_left, yy2 + line_height*0);
        doc.text(`${Util.numberWithCommas(solar_area)} m²`, c1_value_left, yy2 + line_height*0, {width:content_width_div2});
        doc.text(`Solar Capacity :`, c1_name_left, yy2 + line_height*1);
        doc.text(`${Util.numberWithCommas(solar_capacity)} kWp`, c1_value_left, yy2 + line_height*1, {width:content_width_div2});
        doc.text(`Carbon Reduction :`, c2_name_left, yy2 + line_height*0);
        doc.text(`${Util.numberWithCommas(Util.sum(solar_energys)*0.494)} kgCO2`, c2_value_left, yy2 + line_height*0, {width:content_width_div2});
        yy += hh


        var hh = 28
        doc.lineWidth(1);
        doc.rect(page_lr_margin, yy, content_width, hh);
        doc.fillAndStroke(overview_title_color, overview_title_color)
        doc.fontSize(12)
        doc.fillColor('#FFFFFF')
        doc.text(`Energy Production`, c1_name_left, yy+4);
        doc.text(`Battery`, c2_name_left, yy+4);
        yy += hh
  
        hh = 100
        doc.rect(page_lr_margin, yy, content_width/2, hh);
        doc.rect(page_lr_margin+content_width/2, yy, content_width/2, hh);
        doc.stroke("#CCCCCC");
        doc.fontSize(12)
        doc.fillColor('#000000')
        var yy2 = yy + 10
        doc.text(`Daily Production :`, c1_name_left, yy2 + line_height*0);
        doc.text(`Max : ${Util.numberWithCommas(Util.max(solar_energys))} kWh`, c1_value_left, yy2 + line_height*0, {width:content_width_div2});
        doc.text(`Min : ${Util.numberWithCommas(Util.min(solar_energys))} kWh`, c1_value_left, yy2 + line_height*1, {width:content_width_div2});
        doc.text(`Avg : ${Util.numberWithCommas(Util.avg(solar_energys))} kWh`, c1_value_left, yy2 + line_height*2, {width:content_width_div2});
        doc.text(`Total Production :`, c1_name_left, yy2 + line_height*3);
        doc.text(`${Util.numberWithCommas(Util.sum(solar_energys))} kWh`, c1_value_left, yy2 + line_height*3, {width:content_width_div2});
        doc.text(`Battery Capacity :`, c2_name_left, yy2 + line_height*0);
        doc.text(`${Util.numberWithCommas(bat_capacity)} kWh`, c2_value_left, yy2 + line_height*0, {width:content_width_div2});
        doc.text(`Daily SOC :`, c2_name_left, yy2 + line_height*1);
        doc.text(`Max : ${Util.numberWithCommas(Util.max(socs))} %`, c2_value_left, yy2 + line_height*1, {width:content_width_div2});
        doc.text(`Min : ${Util.numberWithCommas(Util.min(socs))} %`, c2_value_left, yy2 + line_height*2, {width:content_width_div2});
        doc.text(`Avg : ${Util.numberWithCommas(Util.avg(socs))} %`, c2_value_left, yy2 + line_height*3, {width:content_width_div2});
        yy += hh


        var hh = 28
        doc.lineWidth(1);
        doc.rect(page_lr_margin, yy, content_width, hh);
        doc.fillAndStroke(overview_title_color, overview_title_color)
        doc.fontSize(12)
        doc.fillColor('#FFFFFF')
        doc.text(`Load Consumption`, c1_name_left, yy+4);
        yy += hh
  
        hh = 100
        doc.rect(page_lr_margin, yy, content_width, hh);
        doc.stroke("#CCCCCC");
        doc.fontSize(12)
        doc.fillColor('#000000')
        var yy2 = yy + 10
        doc.text(`Daily Consumption :`, c1_name_left, yy2 + line_height*0);
        doc.text(`Max : ${Util.numberWithCommas(-Util.min(load_energys))} kWh`, c1_value_left, yy2 + line_height*0, {width:content_width_div2});
        doc.text(`Min : ${Util.numberWithCommas(-Util.max(load_energys))} kWh`, c1_value_left, yy2 + line_height*1, {width:content_width_div2});
        doc.text(`Avg : ${Util.numberWithCommas(-Util.avg(load_energys))} kWh`, c1_value_left, yy2 + line_height*2, {width:content_width_div2});
        doc.text(`Total load consumption:`, c1_name_left, yy2 + line_height*3);
        doc.text(`${Util.numberWithCommas(-Util.sum(load_energys))} kWh`, c1_value_left, yy2 + line_height*3, {width:content_width_div2});
        yy += hh

        yy += 24
        doc.fontSize(18)
        doc.text(`Equipment List`, page_lr_margin, yy);
        yy += 30

        var col_width = content_width/5

        var hh = 28
        var yy2 = yy + 4
        doc.lineWidth(1);
        doc.rect(page_lr_margin, yy, content_width, hh);
        doc.fillAndStroke(overview_title_color, "#000000")
        doc.fontSize(12)
        doc.fillColor('#FFFFFF')
        doc.text(`Device ID`, page_lr_margin, yy2, {width: col_width, align: 'center'});
        doc.text(`Device Name`, page_lr_margin+col_width, yy2, {width: col_width, align: 'center'});
        doc.text(`Device Type`, page_lr_margin+col_width*2, yy2, {width: col_width, align: 'center'});
        doc.text(`Battery Capacity`, page_lr_margin+col_width*3, yy2, {width: col_width, align: 'center'});
        doc.text(`Solar Capacity`, page_lr_margin+col_width*4, yy2, {width: col_width, align: 'center'});

        doc.fontSize(12)
        doc.fillColor('#000000')
        var yy3 = yy + 34
        for (var device of devices) {
          if (yy3>page_height-100) {
            doc.addPage({
              size:'A4'
            });
            drawPageHeader(doc, header_height);
            yy3 = 100
          }
          var device_type = device_types.find(x=>x.device_type_id==device.device_type_id)
          let device_type_name2 = (device_type==null)?'':device_type.device_type_alias_name;

          doc.fontSize(12)
          doc.fillColor('#000000')
  
          let bat_capacity_text = (device.bat_capacity==null) ? '' : device.bat_capacity + ' kWh';
          let solar_capacity_text = (device.solar_capacity==null) ? '' : device.solar_capacity + '';

          doc.text(device.device_name, page_lr_margin, yy3, {width: col_width, align: 'center'});
          doc.text(device.device_alias_name, page_lr_margin+col_width, yy3, {width: col_width, align: 'center'});
          doc.text(device_type_name2, page_lr_margin+col_width*2, yy3, {width: col_width, align: 'center'});
          doc.text(bat_capacity_text, page_lr_margin+col_width*3, yy3, {width: col_width, align: 'center'});
          doc.text(solar_capacity_text, page_lr_margin+col_width*4, yy3, {width: col_width, align: 'center'});
          doc.moveTo(page_lr_margin, yy3+39)
          doc.lineTo(page_lr_margin+content_width, yy3+34)
          doc.stroke(overview_title_color)
          yy3 += 40
        }

        doc.addPage({
          size:'A4'
        });

        drawPageHeader(doc, header_height);

        var min = socs.reduce(
          (accumulator, currentValue) => (currentValue==null) ? accumulator : Math.min(accumulator, currentValue),
          Number.MAX_SAFE_INTEGER
        );
        
        var max = Math.max(...socs)

        var pad = 5;
        var min2 = (min-pad<0)?0:min-pad;
        var max2 = (max+pad>100)?100:max+pad;

        doc.fontSize(18)
        doc.fillColor('#000000')
        doc.text('Energy Analysis Chart', page_lr_margin, header_height+30, {width: content_width});
 
        doc.fontSize(12)
        doc.text('Energy Operation', page_lr_margin, header_height+100, {width: content_width, align: 'center'});
        
        var base64Image = this.createEnergyChart(labels, load_energys, solar_energys, grid_energys, socs, min2, max2)
        doc.image(Buffer.from(base64Image, 'base64'), page_lr_margin, header_height+120, {
          fit: [550, 250],
          align: 'center',
          valign: 'center'
        });

        doc.fontSize(12)
        doc.text('Solar Energy Production and Curtailment Analysis', page_lr_margin, header_height+460, {width: content_width, align: 'center'});

        var base64Image = this.createCurtailmentChart(labels, solar_energys, prediction_energys, curtailment_ratios)
        doc.image(Buffer.from(base64Image, 'base64'), page_lr_margin, header_height+480, {
          fit: [550, 250],
          align: 'center',
          valign: 'center'
        });

        doc.addPage({
          size:'A4'
        });

        drawPageHeader(doc, header_height);

        doc.fontSize(18)
        doc.fillColor('#000000')
        doc.text('Energy Information', page_lr_margin, header_height+30, {width: content_width});
        
        const table_y0 = header_height + 64;
        const column_count = 6;
        const cell_height = 20;
        const cell_width = Math.floor((page_width-page_lr_margin*2)/column_count);
        const text_size = 10;
        const cell_text_top = Math.floor(cell_height-text_size)/2-2

        // table header background
        doc.rect(page_lr_margin, table_y0, page_width-page_lr_margin*2, cell_height);
        doc.fill("#112741")

        // table colume 1 background
        doc.rect(page_lr_margin, table_y0+cell_height, cell_width, cell_height*(data_count+1));
        doc.fill("#EDEDED")

        // table footer background
        doc.rect(page_lr_margin+cell_width, table_y0+cell_height*(data_count+1), page_width-page_lr_margin*2-cell_width, cell_height);
        doc.fill("#D5D6D5")

        // draw vertical line
        for (var c=1; c<column_count; c++) {
          var x = page_lr_margin+c*cell_width;
          doc.lineCap('butt')
            .moveTo(x, table_y0)
            .lineTo(x, table_y0+(data_count+2)*cell_height)
            .stroke('#D3D3D3');
        }

        // draw horizontal line
        for (var n=1; n<data_count+1; n++) {
          var y = table_y0+(n+1)*cell_height
          doc.lineCap('butt')
            .moveTo(page_lr_margin, y)
            .lineTo(page_width-page_lr_margin, y)
            .stroke('#D3D3D3');
        }

        doc.fontSize(text_size)
        doc.fillColor('#FFFFFF')
        var y = table_y0+cell_text_top;
        doc.text(`Date`, page_lr_margin, y, {width: cell_width, align: 'center'});
        doc.text(`Solar(kWh)`, page_lr_margin+cell_width, y, {width: cell_width, align: 'center'});
        doc.text(`Load(kWh)`, page_lr_margin+cell_width*2, y, {width: cell_width, align: 'center'});
        doc.text(`Grid(kWh)`, page_lr_margin+cell_width*3, y, {width: cell_width, align: 'center'});
        doc.text(`SoC(%)`, page_lr_margin+cell_width*4, y, {width: cell_width, align: 'center'});
        doc.text(`Curtailment(%)`, page_lr_margin+cell_width*5, y, {width: cell_width, align: 'center'});

        doc.fillColor('#000000')
        var cell_width2 = cell_width - 10
        if (cell_width2<0) cell_width2=0;
        for (var n=0; n<data_count; n++) {
          var y = table_y0+(n+1)*cell_height+cell_text_top
          doc.text(labels[n], page_lr_margin, y, {width: cell_width, align: 'center'});
          doc.text(Util.numberWithCommas(solar_energys[n]), page_lr_margin+cell_width, y, {width: cell_width2, align: 'right'});
          doc.text(Util.numberWithCommas((load_energys[n]==null) ? null : -load_energys[n]), page_lr_margin+cell_width*2, y, {width: cell_width2, align: 'right'});
          doc.text(Util.numberWithCommas(grid_energys[n]), page_lr_margin+cell_width*3, y, {width: cell_width2, align: 'right'});
          doc.text(Util.numberWithCommas(socs[n]), page_lr_margin+cell_width*4, y, {width: cell_width2, align: 'right'});
          doc.text(Util.numberWithCommas(curtailment_ratios[n]), page_lr_margin+cell_width*5, y, {width: cell_width2, align: 'right'});
        }

        var y = table_y0+(data_count+1)*cell_height+cell_text_top
        doc.text('Total', page_lr_margin, y, {width: cell_width, align: 'center'});

        doc.text(Util.numberWithCommas(Util.sum(solar_energys)), page_lr_margin+cell_width, y, {width: cell_width2, align: 'right'});
        doc.text(Util.numberWithCommas(-Util.sum(load_energys)), page_lr_margin+cell_width*2, y, {width: cell_width2, align: 'right'});
        doc.text(Util.numberWithCommas(Util.sum(grid_energys)), page_lr_margin+cell_width*3, y, {width: cell_width2, align: 'right'});
        doc.text(Util.numberWithCommas(Util.avg(socs)), page_lr_margin+cell_width*4, y, {width: cell_width2, align: 'right'});
        doc.text(Util.numberWithCommas(Util.avg(curtailment_ratios)), page_lr_margin+cell_width*5, y, {width: cell_width2, align: 'right'});

        doc.end()

        const buffer = []
        doc.on('data', buffer.push.bind(buffer))
        doc.on('end', () => {
          const data = Buffer.concat(buffer)
          resolve(data)
        })
      } catch (ex) {
        reject(ex)
        return;
      }
    })

    return pdfBuffer
  }


  /*
  var time_tariffs:Array<{time:number, tariff:number}> = [
      {
          time: 1716781019000,
          tariff: 20
      }, {
          time: 1716781119000,
          tariff: 30
      }, {
          time: 1716781219000,
          tariff: 40
      }
  ];

  代表
  時間 1716781019000~1716781119000 費率 20
  時間 1716781119000~1716781219000 費率 30
  時間 1716781119000~無限 費率 40

  mergeTariff(time_tariffs, start_time, end_time, tariff):Array<{time:number, tariff:number}> {}

  範例一:
  輸入
  mergeTariff(time_tariffs, 1716781009000, 1716781018000, 10);
  輸出
  [
      {
          time: 1716781009000,
          tariff: 10
      }, {
          time: 1716781018000,
          tariff: null
      }, {
          time: 1716781019000,
          tariff: 20
      }, {
          time: 1716781119000,
          tariff: 30
      }, {
          time: 1716781219000,
          tariff: 40
      }
  ]

  範例二:
  輸入
  mergeTariff(time_tariffs, 1716781019000, 1716781215000, 50);
  輸出
  [
      {
          time: 1716781019000,
          tariff: 50
      }, {
          time: 1716781215000,
          tariff: 30
      }, {
          time: 1716781219000,
          tariff: 40
      }
  ];
  */
  mergeTariff(time_tariffs:Array<{time:number, tariff:number}>, start_time:number, end_time:number, tariff:number):Array<{time:number, tariff:number}> {
    if (start_time>=end_time) return time_tariffs;
    if (time_tariffs.length==0) {
      time_tariffs.push({
        time: start_time,
        tariff: tariff
      })
      time_tariffs.push({
        time: end_time,
        tariff: null
      })
    } else if (end_time<time_tariffs[0].time) {
      time_tariffs.splice(0,0,{
        time: start_time,
        tariff: tariff
      })
      time_tariffs.splice(1,0,{
        time: end_time,
        tariff: null
      })
    } else if (end_time==time_tariffs[0].time) {
      time_tariffs.splice(0,0,{
        time: start_time,
        tariff: tariff
      })
    } else {
      var start_index = time_tariffs.findIndex(x=>x.time>=start_time)
      var end_index = time_tariffs.findIndex(x=>x.time>=end_time)
      if (start_index==-1) {
        time_tariffs.push({
          time: start_time,
          tariff: tariff
        })
        time_tariffs.push({
          time: end_time,
          tariff: null
        })
      } else {
        if (end_index!=-1) {
          if (time_tariffs[end_index].time != end_time) {
            if (end_index-1>=0) time_tariffs[end_index-1].time = end_time;
            end_index --;
          }
        }
        if (start_time>time_tariffs[start_index].time) start_index++;
        var delete_count = 0;
        if (end_index==-1) {
          delete_count = time_tariffs.length - start_index;
        } else {
          delete_count = end_index - start_index;
        }
        if (delete_count<0) delete_count = 0;
        time_tariffs.splice(start_index,delete_count,{
          time: start_time,
          tariff: tariff
        })
        if (end_time>time_tariffs[time_tariffs.length-1].time) {
          time_tariffs.push({
            time: end_time,
            tariff: null
          })
        }
      }
    }
    return time_tariffs
  }

  async getDomainFeedInTariff(this_user:UserWithPermission, domain_id):Promise<{ time: string; tariff: number; }[]> {
    var domainService = this.domainService;
    var cache_domains = await domainService.getCacheDomains();
    var time_tariffs:Array<{time:number, tariff:number}> = [];
    var domid = domain_id;
    var domain_ids = [];
    while (domid!=null) {
      var cache_domain = cache_domains.find(x=>x.domain_id==domid)
      if (cache_domain==null) break;
      domain_ids.push(cache_domain.domain_id);
      domid = cache_domain.parent_domain_id;
    }
    if (domain_ids.length==0) return [];
    var domains = await this.domainService.findAll(this_user, {
      where:{
        domain_id: In(domain_ids)
      }
    })
    if (domains.length==0) return [];
    for (var n=domain_ids.length-1; n>=0; n--) {
      var domid = domain_ids[n];
      var domain = domains.find(x=>x.domain_id==domid)
      if (domain.feed_in_tariffs==null || domain.feed_in_tariffs.trim()=='') continue;
      try {
        var tariffs = JSON.parse(domain.feed_in_tariffs)
        if (!Array.isArray(tariffs)) continue;
        var tariffs2 = [];
        for (var tariff of tariffs) {
          var d_start:any = new Date(tariff.start_time);
          if (isNaN(d_start)) continue;
          var d_end:any = new Date(tariff.end_time);
          if (isNaN(d_end)) continue;
          tariffs2.push({
            start_time: d_start.getTime(),
            end_time: d_end.getTime(),
            tariff: tariff.tariff
          })
        }
        tariffs2.sort((a,b)=>{
          return a.start_time-b.start_time
        })
        for (var tariff of tariffs2) {
          this.mergeTariff(time_tariffs, tariff.start_time, tariff.end_time, tariff.tariff);
        }
      } catch (ex) {
        console.log(ex);
      }
    }
    var iso_time_tariffs:Array<{time:string, tariff:number}> = [];
    for (var time_tariff of time_tariffs) {
      iso_time_tariffs.push({
        time: (new Date(time_tariff.time)).toISOString(),
        tariff: time_tariff.tariff
      })
    }
    return iso_time_tariffs;
  }

  async getEssHermesIncome(organization_name, devices, start_time, end_time) {
    if (devices.length==0) return 0;
    var device_names = devices.map(x=>x.device_name)
    var where = {
      DeviceName: device_names
    }
    var params = {
      start: start_time,
      stop: end_time,
      where: JSON.stringify(where),
      fields: 'RevenueToday',
      every: '1d',
      time_function: 'last',
      time_src: '_start',
      group_by: '!DeviceName',
      group_function: 'sum'
    }
    var revenue_todays = await this.deviceDataService.queryInflux(organization_name, 'hermes_today_power_value', params)
    var revenue_sum = revenue_todays.reduce((s,x)=>s+x._value, 0)
    return revenue_sum
  }

  async getGenerateMoney(this_user:UserWithPermission, domain_id, device_type_id, start_time, end_time) {
    var domainServiceEx = this.domainServiceEx;

    var start_time_date:any = new Date(start_time)
    var end_time_date:any = new Date(end_time)
    if (isNaN(start_time_date)) {
      throw new HttpException('start_time is invalid', HttpStatus.BAD_REQUEST);
    }
    if (isNaN(end_time_date)) {
      throw new HttpException('end_time is invalid', HttpStatus.BAD_REQUEST);
    }

    /*
    var fluxQuery = '';
    fluxQuery += 'query1=from(bucket: "鼎硯")';
    fluxQuery += '|> range(start:0, stop: 2024-05-25T08:00:00Z)';
    fluxQuery += '|> filter(fn: (r) => r["_measurement"] == "hermes_report")';
    fluxQuery += '|> filter(fn: (r) => r["_field"] == "SolarEnergy")';
    fluxQuery += '|> filter(fn: (r) => r["device_name"] == "EMS000002")';
    fluxQuery += '|> last()';
    fluxQuery += '|> group()';
    fluxQuery += '|> sum()';
//    fluxQuery += '|> map(fn: (r) => ({ r with table: 0 }))';
    fluxQuery += '|> map(fn: (r) => ({ r with _time: 2024-05-25T08:00:00Z }))';
    fluxQuery += 'query2=from(bucket: "鼎硯")';
    fluxQuery += '|> range(start:0, stop: 2024-05-25T08:00:00Z)';
    fluxQuery += '|> filter(fn: (r) => r["_measurement"] == "hermes_report")';
    fluxQuery += '|> filter(fn: (r) => r["_field"] == "SolarEnergy")';
    fluxQuery += '|> filter(fn: (r) => r["device_name"] == "EMS000003")';
    fluxQuery += '|> last()';
    fluxQuery += '|> group()';
    fluxQuery += '|> sum()';
  //  fluxQuery += '|> map(fn: (r) => ({ r with table: 1 }))';
    fluxQuery += '|> map(fn: (r) => ({ r with _time: 2024-05-26T08:00:00Z }))';
    fluxQuery += 'union(tables: [query1, query2])';
    datas = await this.queryByFlux(fluxQuery);
    console.log(datas)
    */



    var ret = {
      tariffs: [],
      incomes: [],
      ess_hermes_income: 0,
      total_income: 0
    }


    var organization_name = null;
    var domain = null;
    var devices = [];
    var domain_id2 = null;
    if (domain_id!=null && (''+domain_id).trim()!='') {
      domain_id2 = parseInt(domain_id);
      if (isNaN(domain_id2)) {
        throw new HttpException('domain_id is invalid', HttpStatus.BAD_REQUEST);
      }
      domain = await domainServiceEx.findOne(this_user, domain_id2);
      if (domain==null) {
        throw new HttpException('domain not found', HttpStatus.NOT_FOUND);
      }

      var organization_id = await this.domainService.getOrganizationId(domain_id);
      if (organization_id==null) {
        throw new HttpException('Organization of Domain not found.', HttpStatus.NOT_FOUND);
      }
      var organization = await this.domainService.findOne(this_user, organization_id);
      if (organization?.domain_name==null || organization.domain_name.trim()=='') {
        throw new HttpException('Organization name not found.', HttpStatus.NOT_FOUND);
      }
      organization_name = organization.domain_name.trim()

      var args = (device_type_id==null || (''+device_type_id).trim()=='') ? {} : {device_type_id: device_type_id}
      devices = await domainServiceEx.getAllDevices(this_user, this.deviceService, domain_id2, args, 1000000);
    }
    if (devices.length==0) return ret;


    var device_type_ess_hermes = await this.deviceTypeService.findAll(this_user, {where:{device_type_name:'ess_hermes'}})
    if (device_type_ess_hermes.length==0) {
      throw new HttpException('Device type:"ess_hermes" not found.', HttpStatus.NOT_FOUND);
    }
    var device_type_id_ess_hermes = device_type_ess_hermes[0].device_type_id
    var ess_hermes_devices = devices.filter(x=>x.device_type_id==device_type_id_ess_hermes)
    var other_devices = devices.filter(x=>x.device_type_id!=device_type_id_ess_hermes)

    var ess_hermes_income = await this.getEssHermesIncome(organization_name, ess_hermes_devices, start_time, end_time)

    var iso_time_tariffs:any = [];
    var time_tariffs:Array<{time:string, tariff:number, energy:number, diff_energy:number, amount:number}> = []
    var total_amount = 0

    do {
      if (other_devices.length==0) break;
      var device_names = [];
      for (var device of other_devices) {
        //device_names.push(device.device_name)
        device_names.push(`r["${AppConfigService.DEVICE_NAME_FIELD}"]=="${device.device_name}"`)
      }
      var device_names_str = device_names.join(' or ');
      iso_time_tariffs = await this.getDomainFeedInTariff(this_user, domain_id2);
      time_tariffs = JSON.parse(JSON.stringify(iso_time_tariffs))

      function insertTime(time_tariffs, time) {
        var ret_index = -1;
        var date = new Date(time);
        var iso_time = date.toISOString();
        var msec_time = date.getTime();
        if (time_tariffs.length==0) return ret_index;
        var index = time_tariffs.findIndex(x=>(new Date(x.time)).getTime()>=msec_time)
        if (index==-1) {
          time_tariffs.push({
            time: iso_time,
            tariff: time_tariffs[time_tariffs.length-1].tariff
          })
          ret_index = time_tariffs.length-1;
        } else {
          var time_tariff = time_tariffs[index];
          if ((new Date(time_tariff.time)).getTime()==msec_time) {
            ret_index = index
          } else {
            if (index==0) {
              time_tariffs.splice(0,0, {
                time: iso_time,
                tariff: null
              })
              ret_index = 0;
            } else {
              time_tariffs.splice(index,0, {
                time: iso_time,
                tariff: time_tariffs[index-1].tariff
              })
              ret_index = index;
            }
          }
        }
        return ret_index;
      }

      var start_index = insertTime(time_tariffs, start_time)
      var end_index = insertTime(time_tariffs, end_time)
      if(end_index!=-1 && time_tariffs.length-(end_index+1)>0) time_tariffs.splice(end_index+1, time_tariffs.length-(end_index+1))
      if(start_index>0) time_tariffs.splice(0, start_index)

      if (time_tariffs.length==0) return ret;

      var fluxQuery = '';
      var q_names = []
      for (var n=0; n<time_tariffs.length-1; n++) {
        //var fluxQuery = '';
        var time_tariff0 = time_tariffs[n];
        var time_tariff1 = time_tariffs[n+1];

        //if (time_tariff.tariff==null) continue;
        var q_name = 'q'+n;
        q_names.push(q_name)
        var time_tariff_time_start = (new Date(time_tariff0.time)).toISOString();
        var time_tariff_time_stop = (new Date(time_tariff1.time)).toISOString();
        if (time_tariffs.length>2) fluxQuery += `${q_name}=`
        fluxQuery += `from(bucket: "${organization_name}")`;
        fluxQuery += ` |> range(start:${time_tariff_time_start}, stop:${time_tariff_time_stop})`;
      //  fluxQuery += ' |> filter(fn: (r) => r["_measurement"] == "hermes_report")';
        fluxQuery += ' |> filter(fn: (r) => r["_field"] == "SolarEnergy")';
        fluxQuery += ` |> filter(fn: (r) => ${device_names_str})`;
        fluxQuery += ` |> group(columns: ["DeviceName"])`;
        fluxQuery += ` |> sort(columns: ["_time"], desc: false)`;
        fluxQuery += ' |> difference(nonNegative: true)'
        fluxQuery += ' |> group()';
        fluxQuery += ' |> sum()';
        fluxQuery += ` |> map(fn: (r) => ({ r with _time: ${time_tariff_time_start} }))`;
      }
      if (time_tariffs.length>2) fluxQuery += `union(tables: [${q_names.join(',')}])`;
      var datas2:any = await this.deviceDataService.queryByFlux(fluxQuery);

      total_amount = 0;
      for (var data of datas2) {
        var time_tariff = time_tariffs.find(x=>(new Date(x.time)).getTime()==(new Date(data._time)).getTime())
        if (time_tariff!=null) {
          time_tariff.diff_energy = data._value
          if (time_tariff.tariff!=null && time_tariff.diff_energy!=null) {
            time_tariff.amount = time_tariff.tariff * time_tariff.diff_energy;
            total_amount += time_tariff.amount
          }
        }
      }
    } while(false);

    return {
      tariffs: iso_time_tariffs,
      incomes: time_tariffs,
      ess_hermes_income: ess_hermes_income,
      other_income: total_amount,
      total_income: total_amount + ess_hermes_income
    }

  }


}