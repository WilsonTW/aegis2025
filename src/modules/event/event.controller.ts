import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode } from '@nestjs/common';
import { EventService } from './event.service';
import { Event, EventUpdate } from './event.entity';
import { EventControllerBase } from './event.controller.base';

@Controller('api/events')
export class EventController extends EventControllerBase {
  constructor(
    public readonly eventService: EventService,
  ) {
    super(eventService)
  }



}