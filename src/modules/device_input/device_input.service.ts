import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceInput, DeviceInputUpdate } from './device_input.entity';
import { DeviceInputServiceBase } from './device_input.service.base';

@Injectable()
export class DeviceInputService extends DeviceInputServiceBase {
  constructor(
    @InjectRepository(DeviceInput) public readonly deviceInputRepository: Repository<DeviceInput>,
  ) {
    super(deviceInputRepository);
  }

  

}