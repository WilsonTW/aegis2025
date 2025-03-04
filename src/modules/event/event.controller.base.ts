import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { EventService } from './event.service';
import { Event, EventUpdate } from './event.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/events')
export class EventControllerBase {
  constructor(public readonly eventService: EventService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() event: EventUpdate): Promise<Event> {
    return this.eventService.create(req.user, event);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The Event records',
    type: Event,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<Event[]> {
    return this.eventService.findAll(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The Event record',
    type: Event,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<Event> {
    var event:Event = await this.eventService.findOne(req.user, id);
    if (event==null) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }
    return event
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updateEvent: EventUpdate): Promise<Event> {
    return this.eventService.update(req.user, id, updateEvent);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.eventService.remove(req.user, id);
  }
}