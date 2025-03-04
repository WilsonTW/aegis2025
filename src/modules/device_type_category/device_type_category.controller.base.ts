import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { DeviceTypeCategoryService } from './device_type_category.service';
import { DeviceTypeCategory, DeviceTypeCategoryUpdate } from './device_type_category.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/device_type_categorys')
export class DeviceTypeCategoryControllerBase {
  constructor(public readonly deviceTypeCategoryService: DeviceTypeCategoryService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() deviceTypeCategory: DeviceTypeCategoryUpdate): Promise<DeviceTypeCategory> {
    return this.deviceTypeCategoryService.create(req.user, deviceTypeCategory);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The DeviceTypeCategory records',
    type: DeviceTypeCategory,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<DeviceTypeCategory[]> {
    return this.deviceTypeCategoryService.findAll(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The DeviceTypeCategory record',
    type: DeviceTypeCategory,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<DeviceTypeCategory> {
    var deviceTypeCategory:DeviceTypeCategory = await this.deviceTypeCategoryService.findOne(req.user, id);
    if (deviceTypeCategory==null) {
      throw new HttpException('DeviceTypeCategory not found', HttpStatus.NOT_FOUND);
    }
    return deviceTypeCategory
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updateDeviceTypeCategory: DeviceTypeCategoryUpdate): Promise<DeviceTypeCategory> {
    return this.deviceTypeCategoryService.update(req.user, id, updateDeviceTypeCategory);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.deviceTypeCategoryService.remove(req.user, id);
  }
}