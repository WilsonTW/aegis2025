import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode } from '@nestjs/common';
import { DeviceTypeCategoryService } from './device_type_category.service';
import { DeviceTypeCategory, DeviceTypeCategoryUpdate } from './device_type_category.entity';
import { DeviceTypeCategoryControllerBase } from './device_type_category.controller.base';

@Controller('api/device_type_categorys')
export class DeviceTypeCategoryController extends DeviceTypeCategoryControllerBase {
  constructor(
    public readonly deviceTypeCategoryService: DeviceTypeCategoryService,
  ) {
    super(deviceTypeCategoryService)
  }



}