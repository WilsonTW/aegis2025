import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { DeviceTypeService } from './device_type.service';
import { DeviceType, DeviceTypeUpdate } from './device_type.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/device_types')
export class DeviceTypeControllerBase {
  constructor(public readonly deviceTypeService: DeviceTypeService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() deviceType: DeviceTypeUpdate): Promise<DeviceType> {
    return this.deviceTypeService.create(req.user, deviceType);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The DeviceType records',
    type: DeviceType,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<DeviceType[]> {
    return this.deviceTypeService.findAll(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The DeviceType record',
    type: DeviceType,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<DeviceType> {
    var deviceType:DeviceType = await this.deviceTypeService.findOne(req.user, id);
    if (deviceType==null) {
      throw new HttpException('DeviceType not found', HttpStatus.NOT_FOUND);
    }
    return deviceType
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updateDeviceType: DeviceTypeUpdate): Promise<DeviceType> {
    return this.deviceTypeService.update(req.user, id, updateDeviceType);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.deviceTypeService.remove(req.user, id);
  }
}