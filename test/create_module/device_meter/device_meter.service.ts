import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceMeter, DeviceMeterUpdate } from './device_meter.entity';
import { DeviceMeterServiceBase } from './device_meter.service.base';

@Injectable()
export class DeviceMeterService extends DeviceMeterServiceBase {
  constructor(
    @InjectRepository(DeviceMeter) public readonly deviceMeterRepository: Repository<DeviceMeter>,
  ) {
    super(deviceMeterRepository);
  }

  

}