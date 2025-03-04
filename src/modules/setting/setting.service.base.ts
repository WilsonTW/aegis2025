import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting, SettingUpdate } from './setting.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class SettingServiceBase {
  constructor(
    @InjectRepository(Setting) public readonly settingRepository: Repository<Setting>,
  ) {}

  async create(this_user:UserWithPermission, setting: SettingUpdate): Promise<Setting> {
    return await this.settingRepository.save(setting);
    //return await this.settingRepository.insert(setting);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<Setting[]> {
    return await this.settingRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: string): Promise<Setting> {
    return await this.settingRepository.findOne({
        where: {
          setting_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: string, updateSetting: SettingUpdate): Promise<Setting> {
    await this.settingRepository.update(id, updateSetting);
    return await this.settingRepository.findOne({
        where: {
          setting_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: string): Promise<boolean> {
    const result = await this.settingRepository.delete(id);
    return result.affected > 0;
  }
}