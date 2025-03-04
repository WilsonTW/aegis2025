import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceTypeCategory, DeviceTypeCategoryUpdate } from './device_type_category.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class DeviceTypeCategoryServiceBase {
  constructor(
    @InjectRepository(DeviceTypeCategory) public readonly deviceTypeCategoryRepository: Repository<DeviceTypeCategory>,
  ) {}

  async create(this_user:UserWithPermission, deviceTypeCategory: DeviceTypeCategoryUpdate): Promise<DeviceTypeCategory> {
    return await this.deviceTypeCategoryRepository.save(deviceTypeCategory);
    //return await this.deviceTypeCategoryRepository.insert(deviceTypeCategory);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<DeviceTypeCategory[]> {
    return await this.deviceTypeCategoryRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<DeviceTypeCategory> {
    return await this.deviceTypeCategoryRepository.findOne({
        where: {
          device_type_category_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updateDeviceTypeCategory: DeviceTypeCategoryUpdate): Promise<DeviceTypeCategory> {
    await this.deviceTypeCategoryRepository.update(id, updateDeviceTypeCategory);
    return await this.deviceTypeCategoryRepository.findOne({
        where: {
          device_type_category_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.deviceTypeCategoryRepository.delete(id);
    return result.affected > 0;
  }
}