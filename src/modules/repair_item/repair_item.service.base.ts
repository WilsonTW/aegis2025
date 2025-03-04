import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepairItem, RepairItemUpdate } from './repair_item.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class RepairItemServiceBase {
  constructor(
    @InjectRepository(RepairItem) public readonly repairItemRepository: Repository<RepairItem>,
  ) {}

  async create(this_user:UserWithPermission, repairItem: RepairItemUpdate): Promise<RepairItem> {
    return await this.repairItemRepository.save(repairItem);
    //return await this.repairItemRepository.insert(repairItem);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<RepairItem[]> {
    return await this.repairItemRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<RepairItem> {
    return await this.repairItemRepository.findOne({
        where: {
          repair_item_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updateRepairItem: RepairItemUpdate): Promise<RepairItem> {
    await this.repairItemRepository.update(id, updateRepairItem);
    return await this.repairItemRepository.findOne({
        where: {
          repair_item_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.repairItemRepository.delete(id);
    return result.affected > 0;
  }
}