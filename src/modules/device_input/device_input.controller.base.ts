import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { DeviceInputService } from './device_input.service';
import { DeviceInput, DeviceInputUpdate } from './device_input.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/device_inputs')
export class DeviceInputControllerBase {
  constructor(public readonly deviceInputService: DeviceInputService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() deviceInput: DeviceInputUpdate): Promise<DeviceInput> {
    return this.deviceInputService.create(req.user, deviceInput);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The DeviceInput records',
    type: DeviceInput,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<DeviceInput[]> {
    return this.deviceInputService.findAll(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The DeviceInput record',
    type: DeviceInput,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<DeviceInput> {
    var deviceInput:DeviceInput = await this.deviceInputService.findOne(req.user, id);
    if (deviceInput==null) {
      throw new HttpException('DeviceInput not found', HttpStatus.NOT_FOUND);
    }
    return deviceInput
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updateDeviceInput: DeviceInputUpdate): Promise<DeviceInput> {
    return this.deviceInputService.update(req.user, id, updateDeviceInput);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.deviceInputService.remove(req.user, id);
  }
}