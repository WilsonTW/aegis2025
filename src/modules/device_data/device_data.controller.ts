import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, HttpCode, UseGuards, Query, Res, RawBodyRequest, Req, HttpException, HttpStatus } from '@nestjs/common';
import { DeviceDataService } from './device_data.service';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { DomainService } from '../domain/domain.service';
import { DeviceOutputService } from '../device_output/device_output.service';
import { DeviceService } from '../device/device.service';
import { DeviceTypeService } from '../device_type/device_type.service';
import { Request, Response } from 'express';
import * as rawbody from 'raw-body';
import { AppConfigService } from 'src/app_config.service';
import { DeviceDataPredictionService } from './device_data_prediction.service';
import { DeviceReportService } from './device_report.service';
import { Util } from 'src/util/util';

var moment = require('moment-timezone');
require('moment/locale/zh-tw');

@Controller('api/device_datas')
export class DeviceDataController {
  constructor(
    public readonly deviceDataService: DeviceDataService,
    public readonly deviceReportService: DeviceReportService,
    //public readonly deviceDataPredictionService: DeviceDataPredictionService,
    public readonly domainService: DomainService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceService: DeviceService,
    public readonly deviceOutputService: DeviceOutputService,
  ) {}


  //@UseGuards(LocalAuthGuard)
  //@ApiBearerAuth()
  @Post(':organization_id/:measurement_name/write')
  @ApiOperation({ summary: '對平台寫入裝置資料' })
  async writeDeviceData(
    @Param('organization_id') organization_id: number,
    @Param('measurement_name') measurement_name: string,
    @Body() data,
    @Req() req
  ) {
    // we have to check req.readable because of raw-body issue #57
    // https://github.com/stream-utils/raw-body/issues/57
    var json = null;
    if (req.readable) {
      // body is ignored by NestJS -> get raw body from request
      const raw = await rawbody(req);
      const text = raw.toString().trim();
      //console.log('body:', text);
      //console.log('typeof body:', typeof text);
      try {
        json = JSON.parse(text)
      } catch (ex) {
        throw ex;
      }
    } else {
      // body is parsed by NestJS
      //console.log('data:', data);
      //console.log('typeof data:', typeof data);
      json = data;
    }
    console.log('organization_id', organization_id)
    console.log('json', json)
    await this.deviceDataService.writeDeviceData(req.user, organization_id, measurement_name, json)
  }



  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '查詢裝置資料' })
  @ApiQuery({ name: 'organization_id', required:true, description:'ex: "3"' })
  @ApiQuery({ name: 'device_output_name', required:false, description:'ex: "pomcube_data,hermes_smartmeter_data,hermes_report"' })
  @ApiQuery({ name: 'device_type_category_name', required:false, description:'ex: "smart_meter,pv,ess"' })
  @ApiQuery({ name: 'device_type_name', required:false, description:'ex: "pomcube,ess_hermes,pv_inverter,smart_meter"' })
  @ApiQuery({ name: 'domain_id', required:false, description:'ex: "5"' })
  @ApiQuery({ name: 'device_names', required:false, description:'ex: "device1,device2,device3"' })
  @ApiQuery({ name: 'place_names', required:false, description:'ex: "place1,place2,place3"' })
  @ApiQuery({ name: 'start', required:false, description:'ex: "2024-11-17T16:00:00.000Z", "2024-11-18T00:00:00+08:00", "1621726200", "-10s", "-30m", "-6h", "-7d", "-1mo", "-1y"' })
  @ApiQuery({ name: 'stop', required:false, description:'ex: "2024-11-20T16:00:00.000Z"' })
  @ApiQuery({ name: 'fields', required:false, description:'ex: "field1,field2"' })
  @ApiQuery({ name: 'where', required:false, description:'ex: \'{"domain_id":"1","device_name":["device1","device2"]}\' means (domain_id==1 && (device_name=="device1" || device_name=="device2"))' })
  @ApiQuery({ name: 'differenceNonNegativeSource', required:false, description:"Difference NonNegative between subsequent values. one of ['true', 'false']. default is 'false'"})
  @ApiQuery({ name: 'group_by', required:false, example:"!DeviceName,_field", description:'Regroups input data by modifying group key of input tables. If first char of group key is "!", this group key will only be grouped before calculation. ex: "!DeviceName,_field"' })
  @ApiQuery({ name: 'every', required:false, description:'ex: one of ["10s", "1m", "2h", "1d", "1w", "1mo", "1y"]' })
  @ApiQuery({ name: 'create_empty', required:false, description:'Create empty tables for empty window. Default is false. ex: one of [false, true]' })
  @ApiQuery({ name: 'time_src', required:false, description:'Column to use as the source of the new time value for aggregate values. Default is "_stop". ex: one of ["_start", "_stop"]' })
  @ApiQuery({ name: 'timezone', required:false, description:'ex: "Asia/Taipei"' })
  @ApiQuery({ name: 'time_function', required:false, description:"ex: one of ['first', 'last', 'min', 'max', 'mean', 'median', 'count', 'sum', 'spread', 'integral']" })
  @ApiQuery({ name: 'time_function_params', required:false, description:'ex: \'{"unit":"1h"}\'' })
  @ApiQuery({ name: 'difference', required:false, description:"difference between subsequent values. one of ['true', 'false']. default is 'false'"})
  @ApiQuery({ name: 'group_function', required:false, description:"ex: one of ['min', 'max', 'mean', 'median', 'count', 'sum']" })
  @ApiQuery({ name: 'pivot_columns', required:false, description:"collects unique values stored vertically (column-wise) and aligns them horizontally (row-wise) into logical sets. ex: '_field' or 'tag1,tag2'" })
//  @ApiQuery({ name: 'fill_first', required:false, description:"fill the first value if the first value in range is null. one of ['true', 'false']. default is 'false'"})
  @ApiQuery({ name: 'limit', required:false, example:"200"})
  @ApiQuery({ name: 'output_format', required:false, description:"one of ['json', 'csv', 'influx_line_protocol']. default is 'json'"})
  @ApiQuery({ name: 'output_zip', required:false, description:"Output zip file. one of ['true', 'false']. default is 'false'"})
  @ApiQuery({ name: 'debug', required:false, description:"one of ['true', 'false']. default is 'false'"})
  @Get('query')
  async getQuery (
    @Req() req,
    @Res() res: Response,
    //@Query() params: { organization_id?:string, domain_id?:string, device_names?:string, device_output_name:string, start?:string, stop?:string, fields?:string, where?:string, group_by?:string, every?:string, timezone?:string, func?:string }
    @Query('organization_id') organization_id?: string,
    @Query('device_output_name') device_output_name?: string,
    @Query('device_type_category_name') device_type_category_name?: string,
    @Query('device_type_name') device_type_name?: string,
    @Query('domain_id') domain_id?: string,
    @Query('device_names') device_names?: string,
    @Query('place_names') place_names?: string,
    @Query('start') start?: string,
    @Query('stop') stop?: string,
    @Query('fields') fields?: string,
    @Query('where') where?: string,
    @Query('differenceNonNegativeSource') differenceNonNegativeSource?: string,
    @Query('group_by') group_by?: string,
    @Query('every') every?: string,
    @Query('create_empty') create_empty?: string,
    @Query('time_src') time_src?: string,
    @Query('timezone') timezone?: string,
    @Query('time_function') time_function?: string,
    @Query('time_function_params') time_function_params?: string,
    @Query('difference') difference?: string,
    @Query('group_function') group_function?: string,
    @Query('pivot_columns') pivot_columns?: string,
  //  @Query('fill_first') fill_first?: string,
    @Query('limit') limit?: string,
    @Query('output_format') output_format?: string,
    @Query('output_zip') output_zip?: string,
    @Query('debug') debug?: string,
  ): Promise<any> {
    var params = {
      organization_id,
      device_output_name,
      device_type_category_name,
      device_type_name,
      domain_id,
      device_names,
      place_names,
      start,
      stop,
      fields,
      where,
      differenceNonNegativeSource,
      group_by,
      every,
      create_empty,
      time_src,
      timezone,
      time_function,
      time_function_params,
      difference,
      group_function,
      pivot_columns,
//      fill_first,
      limit,
      output_format,
      output_zip,
      debug
    }

    if ((output_zip=='1' || output_zip=='true')) {
      await this.deviceDataService.query(req.user, params, res);
    } else {
      var value = await this.deviceDataService.query(req.user, params, res);
      if (typeof(value)=='object') {
        var text = JSON.stringify(value)
        const textEncoder = new TextEncoder();
        var byte_length = textEncoder.encode(text).length
        res.set({
          'Content-Type': 'application/json',
          'Content-Length': byte_length,
        })
        res.end(text)
      } else {
        if (typeof(value)!='string') value = '' + value
        res.set({
          'Content-Type': 'text/plain',
          'Content-Length': value.length,
        })
        res.end(value)
      }
    }

    //return this.deviceDataService.query(this.domainService, this.deviceTypeService, this.deviceService, this.deviceOutputService, params);
  }


  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '查詢裝置最近資料' })
  @ApiQuery({ name: 'organization_id', required:true, description:'ex: "3"' })
  @ApiQuery({ name: 'device_output_name', required:false, description:'ex: "pomcube_data,hermes_smartmeter_data,hermes_report"' })
  @ApiQuery({ name: 'device_type_category_name', required:false, description:'ex: "smart_meter,pv,ess"' })
  @ApiQuery({ name: 'device_type_name', required:false, description:'ex: "pomcube,ess_hermes,pv_inverter,smart_meter"' })
  @ApiQuery({ name: 'domain_id', required:false, description:'ex: "5"' })
  @ApiQuery({ name: 'device_names', required:false, description:'ex: "device1,device2,device3"' })
  @ApiQuery({ name: 'place_names', required:false, description:'ex: "place1,place2,place3"' })
//  @ApiQuery({ name: 'start', required:false, description:'ex: "2024-11-17T16:00:00.000Z", "2024-11-18T00:00:00+08:00", "1621726200", "-10s", "-30m", "-6h", "-7d", "-1mo", "-1y"' })
//  @ApiQuery({ name: 'stop', required:false, description:'ex: "2024-11-20T16:00:00.000Z"' })
  @ApiQuery({ name: 'fields', required:false, description:'ex: "field1,field2"' })
  @ApiQuery({ name: 'where', required:false, description:'ex: \'{"domain_id":"1","device_name":["device1","device2"]}\' means (domain_id==1 && (device_name=="device1" || device_name=="device2"))' })
//  @ApiQuery({ name: 'differenceNonNegativeSource', required:false, description:"Difference NonNegative between subsequent values. one of ['true', 'false']. default is 'false'"})
  @ApiQuery({ name: 'group_by', required:false, example:"!DeviceName,_field", description:'Regroups input data by modifying group key of input tables. If first char of group key is "!", this group key will only be grouped before calculation. ex: "!DeviceName,_field"' })
//  @ApiQuery({ name: 'every', required:false, description:'ex: one of ["10s", "1m", "2h", "1d", "1w", "1mo", "1y"]' })
//  @ApiQuery({ name: 'create_empty', required:false, description:'Create empty tables for empty window. Default is false. ex: one of [false, true]' })
//  @ApiQuery({ name: 'time_src', required:false, description:'Column to use as the source of the new time value for aggregate values. Default is "_stop". ex: one of ["_start", "_stop"]' })
  @ApiQuery({ name: 'timezone', required:false, description:'ex: "Asia/Taipei"' })
//  @ApiQuery({ name: 'time_function', required:false, description:"ex: one of ['first', 'last', 'min', 'max', 'mean', 'median', 'count', 'sum', 'spread', 'integral']" })
//  @ApiQuery({ name: 'time_function_params', required:false, description:'ex: \'{"unit":"1h"}\'' })
//  @ApiQuery({ name: 'difference', required:false, description:"difference between subsequent values. one of ['true', 'false']. default is 'false'"})
  @ApiQuery({ name: 'group_function', required:false, description:"ex: one of ['min', 'max', 'mean', 'median', 'count', 'sum']" })
  @ApiQuery({ name: 'pivot_columns', required:false, description:"collects unique values stored vertically (column-wise) and aligns them horizontally (row-wise) into logical sets. ex: '_field' or 'tag1,tag2'" })
//  @ApiQuery({ name: 'fill_first', required:false, description:"fill the first value if the first value in range is null. one of ['true', 'false']. default is 'false'"})
  @ApiQuery({ name: 'limit', required:false, example:"200"})
  @ApiQuery({ name: 'output_format', required:false, description:"one of ['json', 'csv', 'influx_line_protocol']. default is 'json'"})
  @ApiQuery({ name: 'output_zip', required:false, description:"Output zip file. one of ['true', 'false']. default is 'false'"})
  @ApiQuery({ name: 'debug', required:false, description:"one of ['true', 'false']. default is 'false'"})
  @Get('query/last')
  async getQueryLast (
    @Res() res: Response,
    //@Query() params: { organization_id?:string, domain_id?:string, device_names?:string, device_output_name:string, start?:string, stop?:string, fields?:string, where?:string, group_by?:string, every?:string, timezone?:string, func?:string }
    @Query('organization_id') organization_id?: string,
    @Query('device_output_name') device_output_name?: string,
    @Query('device_type_category_name') device_type_category_name?: string,
    @Query('device_type_name') device_type_name?: string,
    @Query('domain_id') domain_id?: string,
    @Query('device_names') device_names?: string,
    @Query('place_names') place_names?: string,
  //  @Query('start') start?: string,
  //  @Query('stop') stop?: string,
    @Query('fields') fields?: string,
    @Query('where') where?: string,
  //  @Query('differenceNonNegativeSource') differenceNonNegativeSource?: string,
    @Query('group_by') group_by?: string,
  //  @Query('every') every?: string,
  //  @Query('create_empty') create_empty?: string,
  //  @Query('time_src') time_src?: string,
    @Query('timezone') timezone?: string,
  //  @Query('time_function') time_function?: string,
  //  @Query('time_function_params') time_function_params?: string,
  //  @Query('difference') difference?: string,
    @Query('group_function') group_function?: string,
    @Query('pivot_columns') pivot_columns?: string,
  //  @Query('fill_first') fill_first?: string,
    @Query('limit') limit?: string,
    @Query('output_format') output_format?: string,
    @Query('output_zip') output_zip?: string,
    @Query('debug') debug?: string,
  ): Promise<any> {
    var params:any = {
      organization_id,
      device_output_name,
      device_type_category_name,
      device_type_name,
      domain_id,
      device_names,
      place_names,
    //  start,
    //  stop,
      fields,
      where,
    //  differenceNonNegativeSource,
      group_by,
    //  every,
    //  create_empty,
    //  time_src,
      timezone,
    //  time_function,
    //  time_function_params,
    //  difference,
      group_function,
      pivot_columns,
//      fill_first,
      limit,
      output_format,
      output_zip,
      debug
    }


    var timeout = AppConfigService.getSystemConfig().offline_timeout
    params.start = -Math.floor(timeout/1000) + 's'
    params.time_function = "last"

    if ((output_zip=='1' || output_zip=='true')) {
      await this.deviceDataService.query(params, res);
    } else {
      var value = await this.deviceDataService.query(params, res);
      if (typeof(value)=='object') {
        var text = JSON.stringify(value)
        const textEncoder = new TextEncoder();
        var byte_length = textEncoder.encode(text).length
        res.set({
          'Content-Type': 'application/json',
          'Content-Length': byte_length,
        })
        res.end(text)
      } else {
        if (typeof(value)!='string') value = '' + value
        res.set({
          'Content-Type': 'text/plain',
          'Content-Length': value.length,
        })
        res.end(value)
      }
    }

    //return this.deviceDataService.query(this.domainService, this.deviceTypeService, this.deviceService, this.deviceOutputService, params);
  }



  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '查詢棄電比' })
  @ApiQuery({ name: 'organization_id', required:true, description:'ex: "3"' })
  @ApiQuery({ name: 'device_output_name', required:false, description:'ex: "device_type1_data"' })
  @ApiQuery({ name: 'device_type_category_name', required:false, description:'ex: "smart_meter,pv,ess"' })
  @ApiQuery({ name: 'device_type_name', required:false, description:'ex: "device_type1"' })
  @ApiQuery({ name: 'domain_id', required:false, description:'ex: "5"' })
  @ApiQuery({ name: 'device_names', required:false, description:'ex: "device1,device2,device3"' })
  @ApiQuery({ name: 'place_names', required:false, description:'ex: "place1,place2,place3"' })
  @ApiQuery({ name: 'start', required:false, description:'ex: "2023-09-01T00:00:00.000Z", "1621726200", "-10s", "-30m", "-6h", "-7d", "-1mo", "-1y"' })
  @ApiQuery({ name: 'stop', required:false, description:'ex: "2023-09-01T00:00:00.000Z"' })
  @ApiQuery({ name: 'every', required:false, description:'ex: one of ["1m", "2h", "1d", "1w", "1mo", "1y"]. min is "30m"' })
  @ApiQuery({ name: 'time_src', required:false, description:'Column to use as the source of the new time value for aggregate values. Default is "_stop". ex: one of ["_start", "_stop"]' })
  @ApiQuery({ name: 'timezone', required:false, description:'ex: "Asia/Taipei"' })
  @Get('curtailment_ratio')
  async getCurtailmentRatio (
    @Req() req,
    //@Res() res: Response,
    //@Query() params: { organization_id?:string, domain_id?:string, device_names?:string, device_output_name:string, start?:string, stop?:string, fields?:string, where?:string, group_by?:string, every?:string, timezone?:string, func?:string }
    @Query('organization_id') organization_id?: string,
    @Query('device_output_name') device_output_name?: string,
    @Query('device_type_category_name') device_type_category_name?: string,
    @Query('device_type_name') device_type_name?: string,
    @Query('domain_id') domain_id?: string,
    @Query('device_names') device_names?: string,
    @Query('place_names') place_names?: string,
    @Query('start') start?: string,
    @Query('stop') stop?: string,
    @Query('every') every?: string,
    @Query('time_src') time_src?: string,
    @Query('timezone') timezone?: string,
  ): Promise<any> {
    /*
    var params = {
      organization_id,
      device_output_name,
      device_type_name,
      domain_id,
      device_names,
      place_names,
      start,
      stop,
      every,
      timezone,
    }
    */


    var times = [];
    var solar_energys = []
    var prediction_energys = []
    var curtailment_ratios = []

    if (every==null) every = '1d';

    var params_base = {
      organization_id: organization_id,
      device_type_category_name: device_type_category_name,
      device_type_name: device_type_name,
      domain_id: domain_id,
      device_names: device_names,
      place_names: place_names,
      timezone: timezone,
      start: start,
      stop: stop,
      every: every,
      time_src: time_src,
      group_by: '!DeviceName,_field',
      create_empty: true,
      pivot_columns: '_field',
      where: null
    }

    /*
    var w = await this.deviceDataService.filterDevice(params_base)
    if (w==null) {
      return {
        times,
        solar_energys,
        prediction_energys,
        curtailment_ratios
      }
    }
    params_base.where = JSON.stringify(w.where)
    */

    //var no_data = await this.updateWhere(params)
    //if (no_data) return [];

    var params_energy = Object.assign({
      device_output_name: device_output_name,
      fields: 'LoadEnergy,SolarEnergy,GridEnergy',
      differenceNonNegativeSource: 'true',
      time_function: 'sum',
      group_function: 'sum'
    }, params_base)


    var params_solar_prediction = Object.assign({
      device_output_name: 'solar_prediction',
      fields: 'SolarPower',
      time_function: 'sum',
      group_function: 'sum'
    }, params_base)

  //  var bucket_name = w.organization.domain_name
  //  var measurement_name = w.device_output_names

    //var table_energy = await this.deviceDataService.queryInflux(bucket_name, measurement_name, params_energy)
    //var table_solar_prediction = await this.deviceDataService.queryInflux(bucket_name, measurement_name, params_solar_prediction)
    //var table_solar_prediction = await this.deviceDataService.queryInflux(bucket_name, 'solar_prediction', params_solar_prediction)

    var table_energy = await this.deviceDataService.query(req.user, params_energy)
    var table_solar_prediction = await this.deviceDataService.query(req.user, params_solar_prediction)

    var data_count = table_energy.length
    for (var n=0; n<data_count; n++) {
      times.push(table_energy[n]._time);
      var solar_energy = table_energy[n].SolarEnergy
      var prediction_power = table_solar_prediction[n].SolarPower
      solar_energys.push(solar_energy)
      var prediction_energy = prediction_power==null ? null : prediction_power/4/1000
      prediction_energys.push(prediction_energy)
      var curtailment_ratio = (prediction_energy!=null && table_energy[n].SolarEnergy!=null) ? (1-(table_energy[n].SolarEnergy/prediction_energy))*100 : null
      if (curtailment_ratio!=null) {
        if (curtailment_ratio>100) curtailment_ratio = 100;
        if (curtailment_ratio<0) curtailment_ratio = 0;
      }
      curtailment_ratios.push(curtailment_ratio)
    }

    return {
      times,
      solar_energys,
      prediction_energys,
      curtailment_ratios
    }
  }




  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '查詢 PR 值' })
  @ApiQuery({ name: 'organization_id', required:true, description:'ex: "3"' })
  @ApiQuery({ name: 'device_output_name', required:false, description:'ex: "device_type1_data"' })
  @ApiQuery({ name: 'device_type_category_name', required:false, description:'ex: "smart_meter,pv,ess"' })
  @ApiQuery({ name: 'device_type_name', required:false, description:'ex: "device_type1"' })
  @ApiQuery({ name: 'domain_id', required:false, description:'ex: "5"' })
  @ApiQuery({ name: 'device_names', required:false, description:'ex: "device1,device2,device3"' })
  @ApiQuery({ name: 'place_names', required:false, description:'ex: "place1,place2,place3"' })
  @ApiQuery({ name: 'start', required:false, description:'ex: "2023-09-01T00:00:00.000Z", "1621726200", "-10s", "-30m", "-6h", "-7d", "-1mo", "-1y"' })
  @ApiQuery({ name: 'stop', required:false, description:'ex: "2023-09-01T00:00:00.000Z"' })
  @ApiQuery({ name: 'every', required:false, description:'ex: one of ["1m", "2h", "1d", "1w", "1mo", "1y"]. min is "30m"' })
  @ApiQuery({ name: 'time_src', required:false, description:'Column to use as the source of the new time value for aggregate values. Default is "_stop". ex: one of ["_start", "_stop"]' })
  @ApiQuery({ name: 'timezone', required:false, description:'ex: "Asia/Taipei"' })
  @Get('pr')
  async getPR (
    @Req() req,
    //@Res() res: Response,
    //@Query() params: { organization_id?:string, domain_id?:string, device_names?:string, device_output_name:string, start?:string, stop?:string, fields?:string, where?:string, group_by?:string, every?:string, timezone?:string, func?:string }
    @Query('organization_id') organization_id?: string,
    @Query('device_output_name') device_output_name?: string,
    @Query('device_type_category_name') device_type_category_name?: string,
    @Query('device_type_name') device_type_name?: string,
    @Query('domain_id') domain_id?: string,
    @Query('device_names') device_names?: string,
    @Query('place_names') place_names?: string,
    @Query('start') start?: string,
    @Query('stop') stop?: string,
    @Query('every') every?: string,
    @Query('time_src') time_src?: string,
    @Query('timezone') timezone?: string,
  ): Promise<any> {
    var params = {
      organization_id,
      device_output_name,
      device_type_category_name,
      device_type_name,
      domain_id,
      device_names,
      place_names,
      start,
      stop,
      every,
      time_src,
      timezone,
    }
    return await this.deviceDataService.getPR(req.user, params)
  }




/*
  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'organization_id', required:true, description:'ex: "3"' })
  @ApiQuery({ name: 'device_type_name', required:false, description:'ex: "device_type1"' })
  @ApiQuery({ name: 'domain_id', required:false, description:'ex: "5"' })
  @ApiQuery({ name: 'device_names', required:false, description:'ex: "device1,device2,device3"' })
  @ApiQuery({ name: 'place_names', required:false, description:'ex: "place1,place2,place3"' })
  @ApiQuery({ name: 'start', required:false, description:'ex: "2023-09-01T00:00:00.000Z", "1621726200", "-10s", "-30m", "-6h", "-7d", "-1mo", "-1y"' })
  @ApiQuery({ name: 'stop', required:false, description:'ex: "2023-09-01T00:00:00.000Z"' })
  @ApiQuery({ name: 'timezone', required:false, description:'ex: "Asia/Taipei"' })
  @ApiQuery({ name: 'pivot_column_field', required:false, description:"pivot the data. one of ['true', 'false']. default is 'false'"})

  @Get('solar_prediction')
  getSolarPrediction (
    @Query('organization_id') organization_id?: string,
    @Query('device_type_name') device_type_name?: string,
    @Query('domain_id') domain_id?: string,
    @Query('device_names') device_names?: string,
    @Query('place_names') place_names?: string,
    @Query('start') start?: string,
    @Query('stop') stop?: string,
    @Query('timezone') timezone?: string,
    @Query('pivot_column_field') pivot_column_field?: string,
  ): Promise<any> {
    var params:any = {
      organization_id,
      domain_id,
      device_names,
      place_names,
      start,
      stop,
      timezone,
    }
    if (pivot_column_field=='1' || pivot_column_field=='true') {
      params.pivot_columns = '_field'
    }
    return this.deviceDataPredictionService.getSolarPrediction(params);
  }
*/

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '取得裝置的事件' })
//  @ApiQuery({ name: 'device_type_name', required:true, description:'ex: "device_type1"' })
  @ApiQuery({ name: 'organization_id', required:true, description:'ex: "97"' })
  @ApiQuery({ name: 'domain_id', required:false, description:'ex: "5"' })
  @ApiQuery({ name: 'device_names', required:false, description:'ex: "device1,device2,device3"' })
  @ApiQuery({ name: 'start', required:false, description:'ex: "2023-09-01T00:00:00.000Z", "1621726200", "-10s", "-30m", "-6h", "-7d", "-1mo", "-1y"' })
  @ApiQuery({ name: 'stop', required:false, description:'ex: "2023-09-01T00:00:00.000Z"' })
  @Get('device_event')
  async getDeviceEvent (
    @Req() req,
    //@Query() params: { organization_id?:string, domain_id?:string, device_names?:string, device_output_name:string, start?:string, stop?:string, fields?:string, where?:string, group_by?:string, every?:string, timezone?:string, func?:string }
//    @Query('device_type_name') device_type_name?: string,
    @Query('organization_id') organization_id?: string,
    @Query('domain_id') domain_id?: string,
    @Query('device_names') device_names?: string,
    @Query('start') start?: string,
    @Query('stop') stop?: string,
  ): Promise<any> {
    var params = {
      organization_id,
    //  device_type_name: 'pv_inverter',
      device_output_name: 'hermes_event',
      fields: 'ErrorCode,ErrorDescription',
      where: '{"DeviceType":["pv_inverter","ess_hermes"]}',
      start,
      stop,
      domain_id,
      device_names,
      pivot_columns: '_field',
      debug:false
    }
    var datas = await this.deviceDataService.query(req.user, params);
    if (Array.isArray(datas)) {
      for (var data of datas) {
        delete data.table
      }
    }
    return datas;
  }


  @ApiOperation({ summary: '取得報表' })
  @ApiQuery({ name: 'report_type', required:true, example:"pv", description:'ex: one of {"pv", "ess"}' })
  @ApiQuery({ name: 'time_type', required:true, example:"month", description:'ex: one of {"year", "month"}' })
  @ApiQuery({ name: 'domain_id', required:true, description:'ex: "66"' })
  @ApiQuery({ name: 'device_type_id', required:false, description:'ex: "8"' })
  @ApiQuery({ name: 'year', required:true, description:'ex: "2024"' })
  @ApiQuery({ name: 'month', required:false, description:'0~11 ex: "0:January, 1:February, ..., 11:December"' })
  @ApiQuery({ name: 'timezone', required:false, description:'ex: "Asia/Taipei"' })
  @ApiQuery({ name: 'fake_data', required:false, description:"one of ['true', 'false']. default is 'false'"})
  @Get('report')
  async getPDF(
    @Req() req,
    @Res() res: Response,
    @Query('report_type') report_type?: string,
    @Query('time_type') time_type?: string,
    @Query('domain_id') domain_id?: string,
    @Query('device_type_id') device_type_id?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('timezone') timezone?: string,
    @Query('fake_data') fake_data?: string,
  ): Promise<void> {
    try {
      var buffer = null;
      if (report_type=='pv') {
        buffer = await this.deviceReportService.generatePvPDF(req.user, time_type, domain_id, year, month, timezone, device_type_id, fake_data)
      } else if (report_type=='ess') {
        buffer = await this.deviceReportService.generateEssPDF(req.user, time_type, domain_id, year, month, timezone, device_type_id, fake_data)
      } else {
        throw new HttpException('report_type must be {"pv", "ess"}', HttpStatus.BAD_REQUEST);
      }
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=report.pdf',
      //  'Content-Disposition': 'inline',
        'Content-Length': buffer.length,
      })

      res.end(buffer)
    } catch (ex) {
      throw ex;
    }
  }

}


@Controller()
export class DeviceDataExController {
  constructor(
    public readonly deviceDataService: DeviceDataService,
    public readonly deviceReportService: DeviceReportService,
    //public readonly deviceDataPredictionService: DeviceDataPredictionService,
    public readonly domainService: DomainService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceService: DeviceService,
    public readonly deviceOutputService: DeviceOutputService,
  ) {}


  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '查詢 Domain 資料' })
  @ApiQuery({ name: 'organization_id', required:true, description:'ex: "3"' })
//  @ApiQuery({ name: 'device_output_name', required:false, description:'ex: "pomcube_data,hermes_smartmeter_data,hermes_report"' })
  @ApiQuery({ name: 'device_type_category_name', required:false, description:'ex: "smart_meter,pv,ess"' })
  @ApiQuery({ name: 'device_type_name', required:false, description:'ex: "pomcube,ess_hermes,pv_inverter,smart_meter"' })
  @ApiQuery({ name: 'domain_id', required:false, description:'ex: "5"' })
  @ApiQuery({ name: 'start', required:true, description:'ex: "2024-11-17T16:00:00.000Z", "2024-11-18T00:00:00+08:00", "1621726200", "-10s", "-30m", "-6h", "-7d", "-1mo", "-1y"' })
  @ApiQuery({ name: 'stop', required:false, description:'ex: "2024-11-20T16:00:00.000Z"' })
  @ApiQuery({ name: 'stop_align_every', required:false, description:"The 'stop time' align 'every'. one of ['true', 'false']. default is 'false'"})
  @ApiQuery({ name: 'fields', required:false, description:'ex: "field1,field2"' })
//  @ApiQuery({ name: 'where', required:false, description:'ex: \'{"domain_id":"1","device_name":["device1","device2"]}\' means (domain_id==1 && (device_name=="device1" || device_name=="device2"))' })
//  @ApiQuery({ name: 'differenceNonNegativeSource', required:false, description:"Difference NonNegative between subsequent values. one of ['true', 'false']. default is 'false'"})
//  @ApiQuery({ name: 'group_by', required:false, example:"_field", description:'Regroups input data by modifying group key of input tables. If first char of group key is "!", this group key will only be grouped before calculation. ex: "!DeviceName,_field"' })
  @ApiQuery({ name: 'every', required:false, description:'ex: one of ["10s", "1m", "2h", "1d", "1w", "1mo", "1y"]' })
  @ApiQuery({ name: 'create_empty', required:false, description:'Create empty tables for empty window. Default is false. ex: one of [false, true]' })
  @ApiQuery({ name: 'time_src', required:false, description:'Column to use as the source of the new time value for aggregate values. Default is "_stop". ex: one of ["_start", "_stop"]' })
  @ApiQuery({ name: 'timezone', required:false, description:'ex: "Asia/Taipei"' })
  @ApiQuery({ name: 'time_function', required:false, description:"ex: one of ['first', 'last', 'min', 'max', 'mean', 'median', 'count', 'sum', 'spread', 'integral']" })
  @ApiQuery({ name: 'time_function_params', required:false, description:'ex: \'{"unit":"1h"}\'' })
  //  @ApiQuery({ name: 'difference', required:false, description:"difference between subsequent values. one of ['true', 'false']. default is 'false'"})
//  @ApiQuery({ name: 'group_function', required:false, description:"ex: one of ['min', 'max', 'mean', 'median', 'count', 'sum']" })
//  @ApiQuery({ name: 'pivot_columns', required:false, description:"collects unique values stored vertically (column-wise) and aligns them horizontally (row-wise) into logical sets. ex: '_field' or 'tag1,tag2'" })
//  @ApiQuery({ name: 'fill_first', required:false, description:"fill the first value if the first value in range is null. one of ['true', 'false']. default is 'false'"})
  @ApiQuery({ name: 'limit', required:false, example:"200"})
  @ApiQuery({ name: 'output_format', required:false, description:"one of ['json', 'csv', 'influx_line_protocol']. default is 'json'"})
  @ApiQuery({ name: 'output_zip', required:false, description:"Output zip file. one of ['true', 'false']. default is 'false'"})
  @ApiQuery({ name: 'debug', required:false, description:"one of ['true', 'false']. default is 'false'"})
  @Get('api/domain_datas/query')
  async getQueryDomain (
    @Req() req,
    @Res() res: Response,
    //@Query() params: { organization_id?:string, domain_id?:string, device_names?:string, device_output_name:string, start?:string, stop?:string, fields?:string, where?:string, group_by?:string, every?:string, timezone?:string, func?:string }
    @Query('organization_id') organization_id?: string,
  //  @Query('device_output_name') device_output_name?: string,
    @Query('device_type_category_name') device_type_category_name?: string,
    @Query('device_type_name') device_type_name?: string,
    @Query('domain_id') domain_id?: string,
    @Query('start') start?: string,
    @Query('stop') stop?: string,
    @Query('stop_align_every') stop_align_every?: string,
    @Query('fields') fields?: string,
  //  @Query('where') where?: string,
  //  @Query('differenceNonNegativeSource') differenceNonNegativeSource?: string,
  //  @Query('group_by') group_by?: string,
    @Query('every') every?: string,
    @Query('create_empty') create_empty?: string,
    @Query('time_src') time_src?: string,
    @Query('timezone') timezone?: string,
    @Query('time_function') time_function?: string,
    @Query('time_function_params') time_function_params?: string,
  //  @Query('difference') difference?: string,
  //  @Query('group_function') group_function?: string,
  //  @Query('pivot_columns') pivot_columns?: string,
  //  @Query('fill_first') fill_first?: string,
    @Query('limit') limit?: string,
    @Query('output_format') output_format?: string,
    @Query('output_zip') output_zip?: string,
    @Query('debug') debug?: string,
  ): Promise<any> {
    var params = {
      organization_id,
//      device_output_name,
      device_type_category_name,
      device_type_name,
      domain_id,
      start,
      stop,
      stop_align_every,
      fields,
//      where,
//      differenceNonNegativeSource,
//      group_by,
      every,
      create_empty,
      time_src,
      timezone,
      time_function,
      time_function_params,
//      difference,
//      group_function,
//      pivot_columns,
//      fill_first,
      limit,
      output_format,
      output_zip,
      debug
    }

    if ((output_zip=='1' || output_zip=='true')) {
      await this.deviceDataService.queryDomain(req.user, params, res);
    } else {
      var value = await this.deviceDataService.queryDomain(req.user, params, res);
      if (typeof(value)=='object') {
        var text = JSON.stringify(value)
        const textEncoder = new TextEncoder();
        var byte_length = textEncoder.encode(text).length
        res.set({
          'Content-Type': 'application/json',
          'Content-Length': byte_length,
        })
        res.end(text)
      } else {
        if (typeof(value)!='string') value = '' + value
        res.set({
          'Content-Type': 'text/plain',
          'Content-Length': value.length,
        })
        res.end(value)
      }
    }

    //return this.deviceDataService.query(this.domainService, this.deviceTypeService, this.deviceService, this.deviceOutputService, params);
  }



  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '查詢 Domain 的 Power,SoC,Predict,Photometer 歷史資料' })
  @ApiQuery({ name: 'organization_id', required:true, description:'ex: "3"' })
  @ApiQuery({ name: 'device_type_category_name', required:false, description:'ex: "smart_meter,pv,ess"' })
  @ApiQuery({ name: 'device_type_name', required:false, description:'ex: "pomcube,ess_hermes,pv_inverter,smart_meter"' })
  @ApiQuery({ name: 'domain_id', required:false, description:'ex: "5"' })
  @ApiQuery({ name: 'start', required:true, description:'ex: "2024-11-17T16:00:00.000Z", "2024-11-18T00:00:00+08:00", "1621726200", "-10s", "-30m", "-6h", "-7d", "-1mo", "-1y"' })
  @ApiQuery({ name: 'stop', required:false, description:'ex: "2024-11-20T16:00:00.000Z"' })
//  @ApiQuery({ name: 'stop_align_every', required:false, description:"The 'stop time' align 'every'. one of ['true', 'false']. default is 'false'"})
//  @ApiQuery({ name: 'fields', required:false, description:'ex: "field1,field2"' })
  @ApiQuery({ name: 'every', required:false, description:'ex: one of ["10s", "1m", "2h", "1d", "1w", "1mo", "1y"]' })
  @ApiQuery({ name: 'create_empty', required:false, description:'Create empty tables for empty window. Default is false. ex: one of [false, true]' })
  @ApiQuery({ name: 'time_src', required:false, description:'Column to use as the source of the new time value for aggregate values. Default is "_stop". ex: one of ["_start", "_stop"]' })
  @ApiQuery({ name: 'timezone', required:false, description:'ex: "Asia/Taipei"' })
  @ApiQuery({ name: 'time_function', required:false, description:"ex: one of ['first', 'last', 'min', 'max', 'mean', 'median', 'count', 'sum', 'spread', 'integral']" })
  @ApiQuery({ name: 'time_function_params', required:false, description:'ex: \'{"unit":"1h"}\'' })
  @ApiQuery({ name: 'limit', required:false, example:"200"})
//  @ApiQuery({ name: 'output_format', required:false, description:"one of ['json', 'csv', 'influx_line_protocol']. default is 'json'"})
//  @ApiQuery({ name: 'output_zip', required:false, description:"Output zip file. one of ['true', 'false']. default is 'false'"})
//  @ApiQuery({ name: 'debug', required:false, description:"one of ['true', 'false']. default is 'false'"})
  @Get('api/domain_datas/query/history/power_soc_predict_photometer')
  async getQueryDomainHistoryPowerSocPredictPhotometer (
    @Req() req,
  //  @Res() res: Response,
    //@Query() params: { organization_id?:string, domain_id?:string, device_names?:string, device_output_name:string, start?:string, stop?:string, fields?:string, where?:string, group_by?:string, every?:string, timezone?:string, func?:string }
    @Query('organization_id') organization_id?: string,
  //  @Query('device_output_name') device_output_name?: string,
    @Query('device_type_category_name') device_type_category_name?: string,
    @Query('device_type_name') device_type_name?: string,
    @Query('domain_id') domain_id?: string,
    @Query('start') start?: string,
    @Query('stop') stop?: string,
  //  @Query('stop_align_every') stop_align_every?: string,
  //  @Query('fields') fields?: string,
    @Query('every') every?: string,
    @Query('create_empty') create_empty?: string,
    @Query('time_src') time_src?: string,
    @Query('timezone') timezone?: string,
    @Query('time_function') time_function?: string,
    @Query('time_function_params') time_function_params?: string,
    @Query('limit') limit?: string,
  //  @Query('output_format') output_format?: string,
  //  @Query('output_zip') output_zip?: string,
  //  @Query('debug') debug?: string,
  ): Promise<any> {
    var params = {
      organization_id,
      device_type_category_name,
      device_type_name,
      domain_id,
      start,
      stop,
  //    stop_align_every,
  //    fields,
      every,
      create_empty,
      time_src,
      timezone,
      time_function,
      time_function_params,
      limit,
  //    output_format,
  //    output_zip,
  //    debug
    }


    var a_params = Object.assign({}, params)
    Object.assign(a_params, {
      "fields":"SolarPower,PhotometerSolarPower,BatteryPower,LoadPower,GridPower,GenPower,BatSoC",
      "stop": (new Date()).toISOString(),
      "stop_align_every": "true",
    })
    var a_datas = await this.deviceDataService.queryDomain(req.user, a_params);

    var b_params = Object.assign({}, params)
    Object.assign(b_params, {
      "fields":"PredictionSolarPower"
    })
    var b_datas = await this.deviceDataService.queryDomain(req.user, b_params);

    //var a0_time = a_datas.length>0?(new Date(a_datas[0]._time).getTime()):0
    //var b0_time = b_datas.length>0?(new Date(b_datas[0]._time).getTime()):0
    //var time = Math.min(a0_time, b0_time)
    var na = 0
    var nb = 0
    var datas = []
    while(na<a_datas.length || nb<b_datas.length) {
      //var a_time = na==a_datas.length ? Number.MAX_SAFE_INTEGER : new Date(a_datas[na]._time).getTime()
      //var b_time = nb==b_datas.length ? Number.MAX_SAFE_INTEGER : new Date(b_datas[nb]._time).getTime()

      if (na<a_datas.length && nb<b_datas.length) {
        var a_time = new Date(a_datas[na]._time).getTime()
        var b_time = new Date(b_datas[nb]._time).getTime()

        if (a_time==b_time) {
          var data = Object.assign({}, a_datas[na])
          Object.assign(data, b_datas[nb])
          datas.push(data)
          na++
          nb++
        } else if (a_time>b_time) {
          datas.push(b_datas[nb])
          nb++
        } else if (a_time<b_time) {
          datas.push(a_datas[na])
          na++
        }
      } else if (na==a_datas.length && nb<b_datas.length) {
          datas.push(b_datas[nb])
          nb++
      } else if (na<a_datas.length && nb==b_datas.length) {
        datas.push(a_datas[na])
        na++
      }
    }

    return datas


  }


  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '查詢 Domain 今日資料' })
  @ApiQuery({ name: 'domain_id', required:false, description:'ex: "5"' })
  @ApiQuery({ name: 'timezone', required:false, description:'ex: "Asia/Taipei"' })
  @Get('api/domain_datas/query/today')
  async getQueryDomainToday (
    @Req() req,
    @Query('domain_id') domain_id?: string,
    @Query('timezone') timezone?: string,
  ): Promise<any> {
    var params = {
      domain_id,
      timezone
    }

    var ret = await this.deviceDataService.queryDomainToday(req.user, params)
    return ret
  }



  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '查詢 Domain PR 值' })
  @ApiQuery({ name: 'organization_id', required:true, description:'ex: "3"' })
//  @ApiQuery({ name: 'device_output_name', required:false, description:'ex: "pomcube_data,hermes_smartmeter_data,hermes_report"' })
  @ApiQuery({ name: 'device_type_category_name', required:false, description:'ex: "smart_meter,pv,ess"' })
  @ApiQuery({ name: 'device_type_name', required:false, description:'ex: "pomcube,ess_hermes,pv_inverter,smart_meter"' })
  @ApiQuery({ name: 'domain_id', required:false, description:'ex: "5"' })
  @ApiQuery({ name: 'start', required:false, description:'ex: "2024-11-17T16:00:00.000Z", "2024-11-18T00:00:00+08:00", "1621726200", "-10s", "-30m", "-6h", "-7d", "-1mo", "-1y"' })
  @ApiQuery({ name: 'stop', required:false, description:'ex: "2024-11-20T16:00:00.000Z"' })
  @ApiQuery({ name: 'every', required:false, description:'ex: one of ["10s", "1m", "2h", "1d", "1w", "1mo", "1y"]' })
  @ApiQuery({ name: 'create_empty', required:false, description:'Create empty tables for empty window. Default is false. ex: one of [false, true]' })
  @ApiQuery({ name: 'time_src', required:false, description:'Column to use as the source of the new time value for aggregate values. Default is "_stop". ex: one of ["_start", "_stop"]' })
  @ApiQuery({ name: 'timezone', required:false, description:'ex: "Asia/Taipei"' })
  @ApiQuery({ name: 'limit', required:false, example:"200"})
  @Get('api/domain_datas/query/pr')
  async getQueryDomainPR (
    @Req() req,
    @Res() res: Response,
    @Query('organization_id') organization_id?: string,
    @Query('device_type_category_name') device_type_category_name?: string,
    @Query('device_type_name') device_type_name?: string,
    @Query('domain_id') domain_id?: string,
    @Query('start') start?: string,
    @Query('stop') stop?: string,
    @Query('every') every?: string,
    @Query('create_empty') create_empty?: string,
    @Query('time_src') time_src?: string,
    @Query('timezone') timezone?: string,
    @Query('limit') limit?: string,
  ): Promise<any> {
    var params = {
      organization_id,
      device_type_category_name,
      device_type_name,
      domain_id,
      start,
      stop,
      every,
      create_empty,
      time_src,
      timezone,
      limit
    }


    await this.deviceDataService.queryDomain(req.user, params, res);


  }



  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '取得 domain 的躉售費率' })
  @ApiQuery({ name: 'domain_id', required:true, description:'ex: "5"' })
  @Get('api/feed_in_tariff')
  getDomainFeedInTariff (
    @Req() req,
    @Query('domain_id') domain_id?: string,
  ): Promise<any> {
    return this.deviceReportService.getDomainFeedInTariff(req.user ,domain_id);
  }


  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '計算收入金額' })
  @ApiQuery({ name: 'domain_id', required:true, description:'ex: "66"' })
  @ApiQuery({ name: 'device_type_id', required:false, description:'ex: "8"' })
  @ApiQuery({ name: 'start_time', required:false, description:'ex: "2024-04-30T16:00:00Z"' })
  @ApiQuery({ name: 'end_time', required:false, description:'ex: "2024-05-31T16:00:00Z"' })
  @Get('api/generate_money')
  getGenerateMoney (
    @Req() req,
    @Query('domain_id') domain_id?: string,
    @Query('device_type_id') device_type_id?: string,
    @Query('start_time') start_time?: string,
    @Query('end_time') end_time?: string,
  ): Promise<any> {
    return this.deviceReportService.getGenerateMoney(req.user, domain_id, device_type_id, start_time, end_time);
  }


}