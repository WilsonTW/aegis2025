import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scheduler, SchedulerUpdate } from './scheduler.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class SchedulerServiceBase {
  constructor(
    @InjectRepository(Scheduler) public readonly schedulerRepository: Repository<Scheduler>,
  ) {}

  async create(this_user:UserWithPermission, scheduler: SchedulerUpdate): Promise<Scheduler> {
    return await this.schedulerRepository.save(scheduler);
    //return await this.schedulerRepository.insert(scheduler);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<Scheduler[]> {
    return await this.schedulerRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<Scheduler> {
    return await this.schedulerRepository.findOne({
        where: {
          scheduler_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updateScheduler: SchedulerUpdate): Promise<Scheduler> {
    await this.schedulerRepository.update(id, updateScheduler);
    return await this.schedulerRepository.findOne({
        where: {
          scheduler_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.schedulerRepository.delete(id);
    return result.affected > 0;
  }
}