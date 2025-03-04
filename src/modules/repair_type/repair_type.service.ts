import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepairType, RepairTypeUpdate } from './repair_type.entity';
import { RepairTypeServiceBase } from './repair_type.service.base';

@Injectable()
export class RepairTypeService extends RepairTypeServiceBase {
  constructor(
    @InjectRepository(RepairType) public readonly repairTypeRepository: Repository<RepairType>,
  ) {
    super(repairTypeRepository);
  }

  

}