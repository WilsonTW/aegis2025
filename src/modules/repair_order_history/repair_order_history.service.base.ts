import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepairOrderHistory, RepairOrderHistoryUpdate } from './repair_order_history.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class RepairOrderHistoryServiceBase {
  constructor(
    @InjectRepository(RepairOrderHistory) public readonly repairOrderHistoryRepository: Repository<RepairOrderHistory>,
  ) {}

  async create(this_user:UserWithPermission, repairOrderHistory: RepairOrderHistoryUpdate): Promise<RepairOrderHistory> {
    return await this.repairOrderHistoryRepository.save(repairOrderHistory);
    //return await this.repairOrderHistoryRepository.insert(repairOrderHistory);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<RepairOrderHistory[]> {
    return await this.repairOrderHistoryRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<RepairOrderHistory> {
    return await this.repairOrderHistoryRepository.findOne({
        where: {
          repair_order_history_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updateRepairOrderHistory: RepairOrderHistoryUpdate): Promise<RepairOrderHistory> {
    await this.repairOrderHistoryRepository.update(id, updateRepairOrderHistory);
    return await this.repairOrderHistoryRepository.findOne({
        where: {
          repair_order_history_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.repairOrderHistoryRepository.delete(id);
    return result.affected > 0;
  }
}