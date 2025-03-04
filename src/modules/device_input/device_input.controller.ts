import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode } from '@nestjs/common';
import { DeviceInputService } from './device_input.service';
import { DeviceInput, DeviceInputUpdate } from './device_input.entity';
import { DeviceInputControllerBase } from './device_input.controller.base';

@Controller('api/device_inputs')
export class DeviceInputController extends DeviceInputControllerBase {
  constructor(
    public readonly deviceInputService: DeviceInputService,
  ) {
    super(deviceInputService)
  }



}