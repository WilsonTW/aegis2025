import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode } from '@nestjs/common';
import { DeviceOutputService } from './device_output.service';
import { DeviceOutput, DeviceOutputUpdate } from './device_output.entity';
import { DeviceOutputControllerBase } from './device_output.controller.base';

@Controller('api/device_outputs')
export class DeviceOutputController extends DeviceOutputControllerBase {
  constructor(
    public readonly deviceOutputService: DeviceOutputService,
  ) {
    super(deviceOutputService)
  }



}