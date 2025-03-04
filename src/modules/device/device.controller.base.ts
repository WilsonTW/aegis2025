import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { DeviceService } from './device.service';
import { Device, DeviceUpdate } from './device.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/devices')
export class DeviceControllerBase {
  constructor(public readonly deviceService: DeviceService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() device: DeviceUpdate): Promise<Device> {
    return this.deviceService.create(req.user, device);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The Device records',
    type: Device,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<Device[]> {
    return this.deviceService.findAll(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The Device record',
    type: Device,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<Device> {
    var device:Device = await this.deviceService.findOne(req.user, id);
    if (device==null) {
      throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
    }
    return device
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updateDevice: DeviceUpdate): Promise<Device> {
    return this.deviceService.update(req.user, id, updateDevice);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.deviceService.remove(req.user, id);
  }
}