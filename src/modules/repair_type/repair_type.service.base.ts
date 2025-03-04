import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepairType, RepairTypeUpdate } from './repair_type.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class RepairTypeServiceBase {
  constructor(
    @InjectRepository(RepairType) public readonly repairTypeRepository: Repository<RepairType>,
  ) {}

  async create(this_user:UserWithPermission, repairType: RepairTypeUpdate): Promise<RepairType> {
    return await this.repairTypeRepository.save(repairType);
    //return await this.repairTypeRepository.insert(repairType);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<RepairType[]> {
    return await this.repairTypeRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<RepairType> {
    return await this.repairTypeRepository.findOne({
        where: {
          repair_type_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updateRepairType: RepairTypeUpdate): Promise<RepairType> {
    await this.repairTypeRepository.update(id, updateRepairType);
    return await this.repairTypeRepository.findOne({
        where: {
          repair_type_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.repairTypeRepository.delete(id);
    return result.affected > 0;
  }
}