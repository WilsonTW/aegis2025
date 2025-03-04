import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceMeter, DeviceMeterUpdate } from './device_meter.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class DeviceMeterServiceBase {
  constructor(
    @InjectRepository(DeviceMeter) public readonly deviceMeterRepository: Repository<DeviceMeter>,
  ) {}

  async create(this_user:UserWithPermission, deviceMeter: DeviceMeterUpdate): Promise<DeviceMeter> {
    return await this.deviceMeterRepository.save(deviceMeter);
    //return await this.deviceMeterRepository.insert(deviceMeter);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<DeviceMeter[]> {
    return await this.deviceMeterRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: typeof DeviceMeter.prototype.device_meter_id): Promise<DeviceMeter> {
    return await this.deviceMeterRepository.findOne({
        where: {
          device_meter_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: typeof DeviceMeter.prototype.device_meter_id, updateDeviceMeter: DeviceMeterUpdate): Promise<DeviceMeter> {
    await this.deviceMeterRepository.update(id, updateDeviceMeter);
    return await this.deviceMeterRepository.findOne({
        where: {
          device_meter_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: typeof DeviceMeter.prototype.device_meter_id): Promise<boolean> {
    const result = await this.deviceMeterRepository.delete(id);
    return result.affected > 0;
  }
}