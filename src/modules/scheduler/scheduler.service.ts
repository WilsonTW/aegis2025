import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scheduler, SchedulerUpdate } from './scheduler.entity';
import { SchedulerServiceBase } from './scheduler.service.base';

@Injectable()
export class SchedulerService extends SchedulerServiceBase {
  constructor(
    @InjectRepository(Scheduler) public readonly schedulerRepository: Repository<Scheduler>,
  ) {
    super(schedulerRepository);
  }

  

}