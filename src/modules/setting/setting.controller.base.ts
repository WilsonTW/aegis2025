import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { SettingService } from './setting.service';
import { Setting, SettingUpdate } from './setting.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/settings')
export class SettingControllerBase {
  constructor(public readonly settingService: SettingService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() setting: SettingUpdate): Promise<Setting> {
    return this.settingService.create(req.user, setting);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The Setting records',
    type: Setting,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<Setting[]> {
    return this.settingService.findAll(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The Setting record',
    type: Setting,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string): Promise<Setting> {
    var setting:Setting = await this.settingService.findOne(req.user, id);
    if (setting==null) {
      throw new HttpException('Setting not found', HttpStatus.NOT_FOUND);
    }
    return setting
  }
/*
  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: string, @Body() updateSetting: SettingUpdate): Promise<Setting> {
    return this.settingService.update(req.user, id, updateSetting);
  }
*/
  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string): Promise<boolean> {
    return this.settingService.remove(req.user, id);
  }
}