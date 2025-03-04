import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { PowerSchedulerService } from './power_scheduler.service';
import { PowerScheduler, PowerSchedulerUpdate } from './power_scheduler.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/power_schedulers')
export class PowerSchedulerControllerBase {
  constructor(public readonly powerSchedulerService: PowerSchedulerService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() powerScheduler: PowerSchedulerUpdate): Promise<PowerScheduler> {
    return this.powerSchedulerService.create(req.user, powerScheduler);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The PowerScheduler records',
    type: PowerScheduler,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<PowerScheduler[]> {
    return this.powerSchedulerService.findAll(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The PowerScheduler record',
    type: PowerScheduler,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<PowerScheduler> {
    var powerScheduler:PowerScheduler = await this.powerSchedulerService.findOne(req.user, id);
    if (powerScheduler==null) {
      throw new HttpException('PowerScheduler not found', HttpStatus.NOT_FOUND);
    }
    return powerScheduler
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updatePowerScheduler: PowerSchedulerUpdate): Promise<PowerScheduler> {
    return this.powerSchedulerService.update(req.user, id, updatePowerScheduler);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.powerSchedulerService.remove(req.user, id);
  }
}