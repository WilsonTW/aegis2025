import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode } from '@nestjs/common';
import { SettingService } from './setting.service';
import { Setting, SettingUpdate } from './setting.entity';
import { SettingControllerBase } from './setting.controller.base';

@Controller('api/settings')
export class SettingController extends SettingControllerBase {
  constructor(
    public readonly settingService: SettingService,
  ) {
    super(settingService)
  }



}