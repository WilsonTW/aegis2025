import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventUpdate } from './event.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class EventServiceBase {
  constructor(
    @InjectRepository(Event) public readonly eventRepository: Repository<Event>,
  ) {}

  async create(this_user:UserWithPermission, event: EventUpdate): Promise<Event> {
    return await this.eventRepository.save(event);
    //return await this.eventRepository.insert(event);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<Event[]> {
    return await this.eventRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<Event> {
    return await this.eventRepository.findOne({
        where: {
          event_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updateEvent: EventUpdate): Promise<Event> {
    await this.eventRepository.update(id, updateEvent);
    return await this.eventRepository.findOne({
        where: {
          event_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.eventRepository.delete(id);
    return result.affected > 0;
  }
}