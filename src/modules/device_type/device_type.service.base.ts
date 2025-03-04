import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceType, DeviceTypeUpdate } from './device_type.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class DeviceTypeServiceBase {
  constructor(
    @InjectRepository(DeviceType) public readonly deviceTypeRepository: Repository<DeviceType>,
  ) {}

  async create(this_user:UserWithPermission, deviceType: DeviceTypeUpdate): Promise<DeviceType> {
    return await this.deviceTypeRepository.save(deviceType);
    //return await this.deviceTypeRepository.insert(deviceType);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<DeviceType[]> {
    return await this.deviceTypeRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<DeviceType> {
    return await this.deviceTypeRepository.findOne({
        where: {
          device_type_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updateDeviceType: DeviceTypeUpdate): Promise<DeviceType> {
    await this.deviceTypeRepository.update(id, updateDeviceType);
    return await this.deviceTypeRepository.findOne({
        where: {
          device_type_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.deviceTypeRepository.delete(id);
    return result.affected > 0;
  }
}