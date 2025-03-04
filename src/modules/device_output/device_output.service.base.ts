import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceOutput, DeviceOutputUpdate } from './device_output.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class DeviceOutputServiceBase {
  constructor(
    @InjectRepository(DeviceOutput) public readonly deviceOutputRepository: Repository<DeviceOutput>,
  ) {}

  async create(this_user:UserWithPermission, deviceOutput: DeviceOutputUpdate): Promise<DeviceOutput> {
    return await this.deviceOutputRepository.save(deviceOutput);
    //return await this.deviceOutputRepository.insert(deviceOutput);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<DeviceOutput[]> {
    return await this.deviceOutputRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<DeviceOutput> {
    return await this.deviceOutputRepository.findOne({
        where: {
          device_output_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updateDeviceOutput: DeviceOutputUpdate): Promise<DeviceOutput> {
    await this.deviceOutputRepository.update(id, updateDeviceOutput);
    return await this.deviceOutputRepository.findOne({
        where: {
          device_output_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.deviceOutputRepository.delete(id);
    return result.affected > 0;
  }
}