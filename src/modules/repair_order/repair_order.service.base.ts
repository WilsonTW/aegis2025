import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepairOrder, RepairOrderUpdate } from './repair_order.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class RepairOrderServiceBase {
  constructor(
    @InjectRepository(RepairOrder) public readonly repairOrderRepository: Repository<RepairOrder>,
  ) {}

  async create(this_user:UserWithPermission, repairOrder: RepairOrderUpdate): Promise<RepairOrder> {
    return await this.repairOrderRepository.save(repairOrder);
    //return await this.repairOrderRepository.insert(repairOrder);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<RepairOrder[]> {
    return await this.repairOrderRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<RepairOrder> {
    return await this.repairOrderRepository.findOne({
        where: {
          repair_order_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updateRepairOrder: RepairOrderUpdate): Promise<RepairOrder> {
    await this.repairOrderRepository.update(id, updateRepairOrder);
    return await this.repairOrderRepository.findOne({
        where: {
          repair_order_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.repairOrderRepository.delete(id);
    return result.affected > 0;
  }
}