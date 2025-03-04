import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceOutput, DeviceOutputUpdate } from './device_output.entity';
import { DeviceOutputServiceBase } from './device_output.service.base';

@Injectable()
export class DeviceOutputService extends DeviceOutputServiceBase {
  constructor(
    @InjectRepository(DeviceOutput) public readonly deviceOutputRepository: Repository<DeviceOutput>,
  ) {
    super(deviceOutputRepository);
  }

  

}