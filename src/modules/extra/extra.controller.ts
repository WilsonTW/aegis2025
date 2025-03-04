import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { DataStorerManager } from '../data_storer/mqtt.service';

@Controller('/api/notify_device')
export class ExtraController {
  constructor(
    //public readonly platformDataOutService: PlatformDataOutService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(): String {
    console.log('POST /api/notify_device');
    //DeviceIoManager.notifyDevice(this.deviceIoService);
    return "ok";
  }

}