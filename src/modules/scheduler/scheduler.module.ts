import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulerController } from './scheduler.controller';
import { SchedulersResolver } from './scheduler.resolver';
import { SchedulerService } from './scheduler.service';
import { Scheduler } from './scheduler.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
import { Domain } from "../domain/domain.entity";
import { DomainGet } from "../domain/domain.get.entity";
import { DomainService } from "../domain/domain.service";
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeGet } from "../device_type/device_type.get.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { Device } from "../device/device.entity";
import { DeviceGet } from "../device/device.get.entity";
import { DeviceService } from "../device/device.service";
import { DeviceInput } from "../device_input/device_input.entity";
import { DeviceInputGet } from "../device_input/device_input.get.entity";
import { DeviceInputService } from "../device_input/device_input.service";


@Module({
  imports: [TypeOrmModule.forFeature([Scheduler]), TypeOrmModule.forFeature([Domain]), TypeOrmModule.forFeature([DeviceType]), TypeOrmModule.forFeature([Device]), TypeOrmModule.forFeature([DeviceInput])],
  //controllers: [SchedulerController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, SchedulerService, SchedulersResolver, DomainService, DeviceTypeService, DeviceService, DeviceInputService],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([Scheduler])],
})
export class SchedulerModule {}