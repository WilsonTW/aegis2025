import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepairRecord, RepairRecordUpdate } from './repair_record.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class RepairRecordServiceBase {
  constructor(
    @InjectRepository(RepairRecord) public readonly repairRecordRepository: Repository<RepairRecord>,
  ) {}

  async create(this_user:UserWithPermission, repairRecord: RepairRecordUpdate): Promise<RepairRecord> {
    return await this.repairRecordRepository.save(repairRecord);
    //return await this.repairRecordRepository.insert(repairRecord);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<RepairRecord[]> {
    return await this.repairRecordRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<RepairRecord> {
    return await this.repairRecordRepository.findOne({
        where: {
          repair_record_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updateRepairRecord: RepairRecordUpdate): Promise<RepairRecord> {
    await this.repairRecordRepository.update(id, updateRepairRecord);
    return await this.repairRecordRepository.findOne({
        where: {
          repair_record_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.repairRecordRepository.delete(id);
    return result.affected > 0;
  }
}