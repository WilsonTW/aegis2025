import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode } from '@nestjs/common';
import { DeviceMeterService } from './device_meter.service';
import { DeviceMeter, DeviceMeterUpdate } from './device_meter.entity';
import { DeviceMeterControllerBase } from './device_meter.controller.base';

@Controller('api/device_meters')
export class DeviceMeterController extends DeviceMeterControllerBase {
  constructor(
    public readonly deviceMeterService: DeviceMeterService,
  ) {
    super(deviceMeterService)
  }



}