import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DeviceMeter, DeviceMeterUpdate } from './device_meter.entity';

@Injectable()
export class DeviceMeterService {
  constructor(
    @InjectRepository(DeviceMeter) private readonly deviceMeterRepository: Repository<DeviceMeter>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async create(deviceMeter: DeviceMeterUpdate): Promise<DeviceMeter> {
    return await this.deviceMeterRepository.save(deviceMeter);
    //return await this.deviceMeterRepository.insert(deviceMeter);
  }

  async findAll(options=null): Promise<DeviceMeter[]> {
    return await this.deviceMeterRepository.find(options);
  }

  async findOne(id: number): Promise<DeviceMeter> {
    return await this.deviceMeterRepository.findOne({
        where: {
          device_meter_id:id,
        },
    });
  }

  async update(id: number, updateDeviceMeter: DeviceMeterUpdate): Promise<DeviceMeter> {
    await this.deviceMeterRepository.update(id, updateDeviceMeter);
    return await this.deviceMeterRepository.findOne({
        where: {
          device_meter_id:id,
        },
    });
  }

  async updateAllFields(id: number, updateDeviceMeterDto: Partial<DeviceMeterUpdate>): Promise<DeviceMeter> {
    var ret=null;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const device_meter = await queryRunner.manager.findOne(DeviceMeter, {
        where: {
          device_meter_id: id,
        },
      });
      if (!device_meter) {
        throw new HttpException('"'+id+'" is not found', HttpStatus.NOT_FOUND);
      }
      Object.assign(device_meter, updateDeviceMeterDto);
      ret = await queryRunner.manager.save(DeviceMeter, device_meter);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
    return ret;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.deviceMeterRepository.delete(id);
    return result.affected > 0;
  }
}