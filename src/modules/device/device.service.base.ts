import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device, DeviceUpdate } from './device.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class DeviceServiceBase {
  constructor(
    @InjectRepository(Device) public readonly deviceRepository: Repository<Device>,
  ) {}

  async create(this_user:UserWithPermission, device: DeviceUpdate): Promise<Device> {
    return await this.deviceRepository.save(device);
    //return await this.deviceRepository.insert(device);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<Device[]> {
    return await this.deviceRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<Device> {
    return await this.deviceRepository.findOne({
        where: {
          device_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updateDevice: DeviceUpdate): Promise<Device> {
    await this.deviceRepository.update(id, updateDevice);
    return await this.deviceRepository.findOne({
        where: {
          device_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.deviceRepository.delete(id);
    return result.affected > 0;
  }
}