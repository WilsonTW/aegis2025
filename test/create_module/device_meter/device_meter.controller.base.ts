import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { DeviceMeterService } from './device_meter.service';
import { DeviceMeter, DeviceMeterUpdate } from './device_meter.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/device_meters')
export class DeviceMeterControllerBase {
  constructor(public readonly deviceMeterService: DeviceMeterService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() deviceMeter: DeviceMeterUpdate): Promise<DeviceMeter> {
    return this.deviceMeterService.create(req.user, deviceMeter);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The DeviceMeter records',
    type: DeviceMeter,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<DeviceMeter[]> {
    return this.deviceMeterService.findAll(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The DeviceMeter record',
    type: DeviceMeter,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: typeof DeviceMeter.prototype.device_meter_id): Promise<DeviceMeter> {
    var deviceMeter:DeviceMeter = await this.deviceMeterService.findOne(req.user, id);
    if (deviceMeter==null) {
      throw new HttpException('DeviceMeter not found', HttpStatus.NOT_FOUND);
    }
    return deviceMeter
  }
//--- if patch start ---
  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: typeof DeviceMeter.prototype.device_meter_id, @Body() updateDeviceMeter: DeviceMeterUpdate): Promise<DeviceMeter> {
    return this.deviceMeterService.update(req.user, id, updateDeviceMeter);
  }
//--- if patch end ---
  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: typeof DeviceMeter.prototype.device_meter_id): Promise<boolean> {
    return this.deviceMeterService.remove(req.user, id);
  }
}