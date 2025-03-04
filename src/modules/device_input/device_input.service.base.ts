import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceInput, DeviceInputUpdate } from './device_input.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class DeviceInputServiceBase {
  constructor(
    @InjectRepository(DeviceInput) public readonly deviceInputRepository: Repository<DeviceInput>,
  ) {}

  async create(this_user:UserWithPermission, deviceInput: DeviceInputUpdate): Promise<DeviceInput> {
    return await this.deviceInputRepository.save(deviceInput);
    //return await this.deviceInputRepository.insert(deviceInput);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<DeviceInput[]> {
    return await this.deviceInputRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<DeviceInput> {
    return await this.deviceInputRepository.findOne({
        where: {
          device_input_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updateDeviceInput: DeviceInputUpdate): Promise<DeviceInput> {
    await this.deviceInputRepository.update(id, updateDeviceInput);
    return await this.deviceInputRepository.findOne({
        where: {
          device_input_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.deviceInputRepository.delete(id);
    return result.affected > 0;
  }
}