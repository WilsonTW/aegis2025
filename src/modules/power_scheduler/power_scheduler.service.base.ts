import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PowerScheduler, PowerSchedulerUpdate } from './power_scheduler.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class PowerSchedulerServiceBase {
  constructor(
    @InjectRepository(PowerScheduler) public readonly powerSchedulerRepository: Repository<PowerScheduler>,
  ) {}

  async create(this_user:UserWithPermission, powerScheduler: PowerSchedulerUpdate): Promise<PowerScheduler> {
    return await this.powerSchedulerRepository.save(powerScheduler);
    //return await this.powerSchedulerRepository.insert(powerScheduler);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<PowerScheduler[]> {
    return await this.powerSchedulerRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<PowerScheduler> {
    return await this.powerSchedulerRepository.findOne({
        where: {
          power_scheduler_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updatePowerScheduler: PowerSchedulerUpdate): Promise<PowerScheduler> {
    await this.powerSchedulerRepository.update(id, updatePowerScheduler);
    return await this.powerSchedulerRepository.findOne({
        where: {
          power_scheduler_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.powerSchedulerRepository.delete(id);
    return result.affected > 0;
  }
}