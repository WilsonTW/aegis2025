import { HttpException, HttpStatus, Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceType, DeviceTypeUpdate } from './device_type.entity';
import { DeviceTypeServiceBase } from './device_type.service.base';
import { Util } from 'src/util/util';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class DeviceTypeService extends DeviceTypeServiceBase {
  constructor(
    @InjectRepository(DeviceType) public readonly deviceTypeRepository: Repository<DeviceType>,
  ) {
    super(deviceTypeRepository);
  }


  async create(this_user:UserWithPermission, deviceType: DeviceTypeUpdate): Promise<DeviceType> {
    var ret = await this.deviceTypeRepository.save(deviceType);
    Util.notifyDeviceChanged();
    return ret;
    //return await this.deviceTypeRepository.insert(deviceType);
  }

  async update(this_user:UserWithPermission, id: number, updateDeviceType: DeviceTypeUpdate): Promise<DeviceType> {
    await this.deviceTypeRepository.update(id, updateDeviceType);
    var ret = await this.deviceTypeRepository.findOne({
        where: {
          device_type_id:id,
        },
    });
    Util.notifyDeviceChanged();
    return ret;
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.deviceTypeRepository.delete(id);
    Util.notifyDeviceChanged();
    return result.affected > 0;
  }

}