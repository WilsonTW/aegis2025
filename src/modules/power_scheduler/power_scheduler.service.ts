import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PowerScheduler, PowerSchedulerUpdate } from './power_scheduler.entity';
import { PowerSchedulerServiceBase } from './power_scheduler.service.base';

@Injectable()
export class PowerSchedulerService extends PowerSchedulerServiceBase {
  constructor(
    @InjectRepository(PowerScheduler) public readonly powerSchedulerRepository: Repository<PowerScheduler>,
  ) {
    super(powerSchedulerRepository);
  }

  

}