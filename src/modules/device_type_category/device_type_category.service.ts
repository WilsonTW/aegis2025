import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceTypeCategory, DeviceTypeCategoryUpdate } from './device_type_category.entity';
import { DeviceTypeCategoryServiceBase } from './device_type_category.service.base';

@Injectable()
export class DeviceTypeCategoryService extends DeviceTypeCategoryServiceBase {
  constructor(
    @InjectRepository(DeviceTypeCategory) public readonly deviceTypeCategoryRepository: Repository<DeviceTypeCategory>,
  ) {
    super(deviceTypeCategoryRepository);
  }

  

}