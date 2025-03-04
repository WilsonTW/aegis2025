import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { DeviceConnection, DeviceConnectionUpdate } from './device_connection.entity';
import { DeviceConnectionServiceBase } from './device_connection.service.base';
import { Util } from 'src/util/util';
import { UserWithPermission } from '../user/user_with_permission.entity';
import { DomainService } from '../domain/domain.service';
import { GetDeviceConnectionArgs } from './device_connection.args';

@Injectable()
export class DeviceConnectionService extends DeviceConnectionServiceBase {
  constructor(
    @InjectRepository(DeviceConnection) public readonly deviceConnectionRepository: Repository<DeviceConnection>,
    public readonly domainService: DomainService,
  ) {
    super(deviceConnectionRepository);
  }


  async checkData(this_user:UserWithPermission, device_connection: DeviceConnectionUpdate, device_connection_id=null) {
    if (device_connection_id!=null) {
      var device_connection2:DeviceConnection = await this.findOneInDomain(this_user, device_connection_id)
      if (device_connection2==null) {
        throw new HttpException('The device_connection is not in this domain', HttpStatus.FORBIDDEN);
      }
    }

    /*
    if (device_connection?.organization_id!=null) {
      if (this_user.domain_id != device_connection.organization_id) {
        throw new HttpException('organization_id is out of domain', HttpStatus.FORBIDDEN);
      }
    }
    */

    if (device_connection?.device_connection_name!=null) {
      if ((''+device_connection.device_connection_name).trim()=='') {
        throw new HttpException('device_connection_name is null', HttpStatus.BAD_REQUEST);
      }
    }

    if (device_connection!=null) {
      var organization_id = await this.domainService.getOrganizationId(this_user.domain_id)
      device_connection.organization_id = organization_id
    }
  }


  async findAllInDomain(this_user:UserWithPermission, options=null): Promise<DeviceConnection[]> {
    var organization_id = await this.domainService.getOrganizationId(this_user.domain_id)
    if (this_user.domain_id != organization_id) {
      return []
    }
    options ??= {}
    options.where ??= {}
    options.where.organization_id = this_user.domain_id
    return await this.deviceConnectionRepository.find(options);
  }

  async findOneInDomain(this_user:UserWithPermission, id: number): Promise<DeviceConnection> {
    var options2:FindManyOptions<DeviceConnection> = {where:{device_connection_id: id}}
    var device_connections:DeviceConnection[] = await this.findAllInDomain(this_user, options2)
    return device_connections.length>0 ? device_connections[0] : null;
  }

  async create(this_user:UserWithPermission, deviceConnection: DeviceConnectionUpdate): Promise<DeviceConnection> {
    await this.checkData(this_user, deviceConnection)
    var ret = await this.deviceConnectionRepository.save(deviceConnection);
    Util.notifyDeviceChanged();
    return ret;
    //return await this.deviceConnectionRepository.insert(deviceConnection);
  }


  async update(this_user:UserWithPermission, id: number, updateDeviceConnection: DeviceConnectionUpdate): Promise<DeviceConnection> {
    await this.checkData(this_user, updateDeviceConnection, id)
    await this.deviceConnectionRepository.update(id, updateDeviceConnection);
    var ret = await this.deviceConnectionRepository.findOne({
        where: {
          device_connection_id:id,
        },
    });
    Util.notifyDeviceChanged();
    return ret
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    await this.checkData(this_user, null, id)
    const result = await this.deviceConnectionRepository.delete(id);
    Util.notifyDeviceChanged();
    return result.affected > 0;
  }

}