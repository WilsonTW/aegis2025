import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, UseFilters, HttpException, HttpStatus } from '@nestjs/common';
import { DeviceConnectionService } from './device_connection.service';
import { DeviceConnection, DeviceConnectionUpdate } from './device_connection.entity';
import { DeviceConnectionControllerBase } from './device_connection.controller.base';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { DataStorerManager } from '../data_storer/mqtt.service';

@Controller('api/device_connections')
export class DeviceConnectionController extends DeviceConnectionControllerBase {
  constructor(
    public readonly deviceConnectionService: DeviceConnectionService,
  ) {
    super(deviceConnectionService)
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post('/update_all')
  async updateAllConnection(@Request() req): Promise<void> {
    return DataStorerManager.updateAllConnection();
  }


  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The DeviceConnection records',
    type: DeviceConnection,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<DeviceConnection[]> {
    return this.deviceConnectionService.findAllInDomain(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The DeviceConnection record',
    type: DeviceConnection,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<DeviceConnection> {
    var deviceConnection:DeviceConnection = await this.deviceConnectionService.findOneInDomain(req.user, id);
    if (deviceConnection==null) {
      throw new HttpException('DeviceConnection not found', HttpStatus.NOT_FOUND);
    }
    return deviceConnection
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Request() req, @Body() deviceConnection: DeviceConnectionUpdate): Promise<DeviceConnection> {
    var ret = await this.deviceConnectionService.create(req.user, deviceConnection);
    await DataStorerManager.updateAllConnection();
    return ret;
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(@Request() req, @Param('id') id: number, @Body() updateDeviceConnection: DeviceConnectionUpdate): Promise<DeviceConnection> {
    var ret = await this.deviceConnectionService.update(req.user, id, updateDeviceConnection);
    await DataStorerManager.updateAllConnection();
    return ret;
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    var ret = await this.deviceConnectionService.remove(req.user, id);
    await DataStorerManager.updateAllConnection();
    return ret;
  }


}