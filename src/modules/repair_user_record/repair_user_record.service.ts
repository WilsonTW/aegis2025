import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepairUserRecord, RepairUserRecordUpdate } from './repair_user_record.entity';
import { RepairUserRecordServiceBase } from './repair_user_record.service.base';

@Injectable()
export class RepairUserRecordService extends RepairUserRecordServiceBase {
  constructor(
    @InjectRepository(RepairUserRecord) public readonly repairUserRecordRepository: Repository<RepairUserRecord>,
  ) {
    super(repairUserRecordRepository);
  }

  

}