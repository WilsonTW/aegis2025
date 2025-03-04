import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventUpdate } from './event.entity';
import { EventServiceBase } from './event.service.base';

@Injectable()
export class EventService extends EventServiceBase {
  constructor(
    @InjectRepository(Event) public readonly eventRepository: Repository<Event>,
  ) {
    super(eventRepository);
  }

  

}