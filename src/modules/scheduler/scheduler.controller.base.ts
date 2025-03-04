import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { Scheduler, SchedulerUpdate } from './scheduler.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/schedulers')
export class SchedulerControllerBase {
  constructor(public readonly schedulerService: SchedulerService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() scheduler: SchedulerUpdate): Promise<Scheduler> {
    return this.schedulerService.create(req.user, scheduler);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The Scheduler records',
    type: Scheduler,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<Scheduler[]> {
    return this.schedulerService.findAll(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The Scheduler record',
    type: Scheduler,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<Scheduler> {
    var scheduler:Scheduler = await this.schedulerService.findOne(req.user, id);
    if (scheduler==null) {
      throw new HttpException('Scheduler not found', HttpStatus.NOT_FOUND);
    }
    return scheduler
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updateScheduler: SchedulerUpdate): Promise<Scheduler> {
    return this.schedulerService.update(req.user, id, updateScheduler);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.schedulerService.remove(req.user, id);
  }
}