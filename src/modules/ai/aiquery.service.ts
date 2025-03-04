import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Device } from '../device/device.entity';
import { Domain } from '../domain/domain.entity';
import { DomainService } from '../domain/domain.service';
import { DeviceService } from '../device/device.service';
import { UserService } from '../user/user.service';


@Injectable()
export class AIQueryService {

  constructor(
    public readonly userService: UserService,
    public readonly domainService: DomainService,
    public readonly deviceService: DeviceService,
  ) {
  }


}