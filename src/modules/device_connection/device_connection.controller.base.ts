import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { DeviceConnectionService } from './device_connection.service';
import { DeviceConnection, DeviceConnectionUpdate } from './device_connection.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/device_connections')
export class DeviceConnectionControllerBase {
  constructor(public readonly deviceConnectionService: DeviceConnectionService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() deviceConnection: DeviceConnectionUpdate): Promise<DeviceConnection> {
    return this.deviceConnectionService.create(req.user, deviceConnection);
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
    return this.deviceConnectionService.findAll(req.user);
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
    var deviceConnection:DeviceConnection = await this.deviceConnectionService.findOne(req.user, id);
    if (deviceConnection==null) {
      throw new HttpException('DeviceConnection not found', HttpStatus.NOT_FOUND);
    }
    return deviceConnection
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updateDeviceConnection: DeviceConnectionUpdate): Promise<DeviceConnection> {
    return this.deviceConnectionService.update(req.user, id, updateDeviceConnection);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.deviceConnectionService.remove(req.user, id);
  }
}