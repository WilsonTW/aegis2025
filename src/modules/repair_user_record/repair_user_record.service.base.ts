import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepairUserRecord, RepairUserRecordUpdate } from './repair_user_record.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class RepairUserRecordServiceBase {
  constructor(
    @InjectRepository(RepairUserRecord) public readonly repairUserRecordRepository: Repository<RepairUserRecord>,
  ) {}

  async create(this_user:UserWithPermission, repairUserRecord: RepairUserRecordUpdate): Promise<RepairUserRecord> {
    return await this.repairUserRecordRepository.save(repairUserRecord);
    //return await this.repairUserRecordRepository.insert(repairUserRecord);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<RepairUserRecord[]> {
    return await this.repairUserRecordRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<RepairUserRecord> {
    return await this.repairUserRecordRepository.findOne({
        where: {
          repair_user_record_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updateRepairUserRecord: RepairUserRecordUpdate): Promise<RepairUserRecord> {
    await this.repairUserRecordRepository.update(id, updateRepairUserRecord);
    return await this.repairUserRecordRepository.findOne({
        where: {
          repair_user_record_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.repairUserRecordRepository.delete(id);
    return result.affected > 0;
  }
}