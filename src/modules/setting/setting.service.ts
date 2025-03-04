import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting, SettingUpdate } from './setting.entity';
import { SettingServiceBase } from './setting.service.base';

@Injectable()
export class SettingService extends SettingServiceBase {
  constructor(
    @InjectRepository(Setting) public readonly settingRepository: Repository<Setting>,
  ) {
    super(settingRepository);
  }

  

}