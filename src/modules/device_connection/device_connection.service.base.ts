import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceConnection, DeviceConnectionUpdate } from './device_connection.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class DeviceConnectionServiceBase {
  constructor(
    @InjectRepository(DeviceConnection) public readonly deviceConnectionRepository: Repository<DeviceConnection>,
  ) {}

  async create(this_user:UserWithPermission, deviceConnection: DeviceConnectionUpdate): Promise<DeviceConnection> {
    return await this.deviceConnectionRepository.save(deviceConnection);
    //return await this.deviceConnectionRepository.insert(deviceConnection);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<DeviceConnection[]> {
    return await this.deviceConnectionRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<DeviceConnection> {
    return await this.deviceConnectionRepository.findOne({
        where: {
          device_connection_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updateDeviceConnection: DeviceConnectionUpdate): Promise<DeviceConnection> {
    await this.deviceConnectionRepository.update(id, updateDeviceConnection);
    return await this.deviceConnectionRepository.findOne({
        where: {
          device_connection_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.deviceConnectionRepository.delete(id);
    return result.affected > 0;
  }
}