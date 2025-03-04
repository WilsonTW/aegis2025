import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, HttpException, HttpStatus, Req, Request } from '@nestjs/common';
import { Device, DeviceUpdate } from './device.entity';
import { DeviceControllerBase } from './device.controller.base';
import { DeviceTypeService } from '../device_type/device_type.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { DeviceTypeTriggerArg } from '../device_type/device_type.controller';
import { Util } from 'src/util/util';
import { DataStorerManager } from '../data_storer/mqtt.service';
import { DeviceInputService } from '../device_input/device_input.service';
import { DeviceService } from './device.service';
import * as rawbody from 'raw-body';

@Controller('api/devices')
export class DeviceController extends DeviceControllerBase {
  constructor(
    public readonly deviceService: DeviceService,
  //  public readonly deviceExService: DeviceExService,
  //  public readonly deviceTypeService: DeviceTypeService,
  //  public readonly deviceInputService: DeviceInputService
  ) {
    super(deviceService)
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The Device records',
    type: Device,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<Device[]> {
    return this.deviceService.findAllInDomain(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The Device record',
    type: Device,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<Device> {
    var device:Device = await this.deviceService.findOneInDomain(req.user, id);
    if (device==null) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }
    return device
  }

}


@Controller('api/devices')
export class DeviceControllerEx extends DeviceController {
  constructor(
    public readonly deviceService: DeviceService,
    public readonly deviceExService: DeviceService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceInputService: DeviceInputService
  ) {
    super(deviceExService)
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post(':device_id/trigger')
  async trigger(
    @Request() req,
    @Param('device_id') device_id: number,
    @Body() arg: DeviceTypeTriggerArg
  ): Promise<boolean> {
    function replaceText(text, arg, varis) {
      var replaces = [];
      for (var vari of varis) {
        var vari_segs = vari.split('.');
        var v = arg;
        for (var seg of vari_segs) {
          v = v[seg];
          if (v==null) break;
        }
        //replaces.push({name:vari, value:JSON.stringify(v)});
        replaces.push({name:vari, value:v});
      }
      return Util.fillTemplate(text, replaces);
    }

    if (arg?.device_input_id==null) {
      throw new HttpException('param.device_input_id is null', HttpStatus.BAD_REQUEST);
    }

    var device = await this.deviceService.findOne(req.user, device_id);
    if (device==null) {
      throw new HttpException('Device is not found', HttpStatus.NOT_FOUND);
    }

    var device_type = await this.deviceTypeService.findOne(req.user, device.device_type_id);
    if (device_type==null) {
      throw new HttpException('DeviceType is not found', HttpStatus.NOT_FOUND);
    }
    
    var device_input = await this.deviceInputService.findOne(req.user, arg.device_input_id);
    if (device_input==null) {
      throw new HttpException('DeviceInput is not found', HttpStatus.NOT_FOUND);
    }

    if (device_input.device_type_id!=device_type.device_type_id) {
      throw new HttpException('device_input.device_type_id != device_type.device_type_id', HttpStatus.BAD_REQUEST);
    }

    if (device_input.input_type=='mqtt') {
      if (device.device_connection_id!=null && device_input.path!=null) {
        // device_input.path='/${device.device_name}/control';
        var path_varis = Util.extractVariables(device_input.path);
        var query_varis = (device_input.query==null)?[]:Util.extractVariables(device_input.query);

        var arg2:any = arg;
        arg2.device = {device_name:device.device_name}
        var path2 = replaceText(device_input.path, arg2, path_varis)
        var query2 = replaceText(device_input.query, arg2, query_varis)
        DataStorerManager.publicData(device.device_connection_id, path2, query2);

        /*
        var device_names = [];
        var need_replace_device_name = false;
        if (path_varis.indexOf('device.device_name')!=-1 || query_varis.indexOf('device.device_name')!=-1) {
          need_replace_device_name = true;
          if (arg?.domain_id!=null) {
            var devices = await this.domainServiceEx.getAllDevices(this.deviceService, arg.domain_id, {
              device_type_id: device_type.device_type_id
            }, 1000000)
            for (var device of devices) {
              if (device_names.indexOf(device.device_name)==-1) device_names.push(device.device_name)
            }
          }
          if (arg?.device_name!=null) {
            var devices = await this.deviceService.findAll({
              where: {
                device_type_id: device_type.device_type_id,
                device_name: arg.device_name
              }
            });
            for (var device of devices) {
              if (device_names.indexOf(device.device_name)==-1) device_names.push(device.device_name)
            }
          }
        }

        if (!need_replace_device_name) {
          var path2 = replaceText(device_input.path, arg, path_varis)
          var query2 = replaceText(device_input.query, arg, query_varis)
          DataStorerManager.publicData(device_input.device_connection_id, path2, query2);
        } else {
          var arg2:any = arg;
          for (var device_name of device_names) {
            arg2.device = {device_name:device_name}
            var path2 = replaceText(device_input.path, arg2, path_varis)
            var query2 = replaceText(device_input.query, arg2, query_varis)
            DataStorerManager.publicData(device_input.device_connection_id, path2, query2);
          }
        }
        */
        
      }
    }


    return false;
  }


  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send data to device' })
  @ApiConsumes('text/plain')
  @ApiBody({
    description: '傳送給裝置的資料. "null" 代表無資料',
    type: String,
  })
  @Post(':device_id/send/:device_input_name')
  async sendDataToDevice(
    @Param('device_id') device_id: number,
    @Param('device_input_name') device_input_name: string,
    @Req() req,
    //@Body() data: string
  ): Promise<any> {
    const raw = await rawbody(req);
    const data = raw.toString().trim();
    /*
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
    */


    var ret = await this.deviceExService.sendDataToDevice(req.user, device_id, device_input_name, data)
    return ret
  }

}