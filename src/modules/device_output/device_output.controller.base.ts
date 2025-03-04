import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { DeviceOutputService } from './device_output.service';
import { DeviceOutput, DeviceOutputUpdate } from './device_output.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/device_outputs')
export class DeviceOutputControllerBase {
  constructor(public readonly deviceOutputService: DeviceOutputService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() deviceOutput: DeviceOutputUpdate): Promise<DeviceOutput> {
    return this.deviceOutputService.create(req.user, deviceOutput);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The DeviceOutput records',
    type: DeviceOutput,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<DeviceOutput[]> {
    return this.deviceOutputService.findAll(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The DeviceOutput record',
    type: DeviceOutput,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<DeviceOutput> {
    var deviceOutput:DeviceOutput = await this.deviceOutputService.findOne(req.user, id);
    if (deviceOutput==null) {
      throw new HttpException('DeviceOutput not found', HttpStatus.NOT_FOUND);
    }
    return deviceOutput
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updateDeviceOutput: DeviceOutputUpdate): Promise<DeviceOutput> {
    return this.deviceOutputService.update(req.user, id, updateDeviceOutput);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.deviceOutputService.remove(req.user, id);
  }
}