import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { Scheduler, SchedulerUpdate } from './scheduler.entity';
import { SchedulerControllerBase } from './scheduler.controller.base';

@Controller('api/schedulers')
export class SchedulerController extends SchedulerControllerBase {
  constructor(
    public readonly schedulerService: SchedulerService,
  ) {
    super(schedulerService)
  }



}