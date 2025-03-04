import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceController } from './device.controller';
import { DevicesResolver } from './device.resolver';
import { DeviceService } from './device.service';
import { Device } from './device.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeGet } from "../device_type/device_type.get.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { DeviceTypeCategory } from "../device_type_category/device_type_category.entity";
import { DeviceTypeCategoryGet } from "../device_type_category/device_type_category.get.entity";
import { DeviceTypeCategoryService } from "../device_type_category/device_type_category.service";
import { DeviceConnection } from "../device_connection/device_connection.entity";
import { DeviceConnectionGet } from "../device_connection/device_connection.get.entity";
import { DeviceConnectionService } from "../device_connection/device_connection.service";
import { Domain } from "../domain/domain.entity";
import { DomainGet } from "../domain/domain.get.entity";
import { DomainService } from "../domain/domain.service";
import { PowerScheduler } from "../power_scheduler/power_scheduler.entity";
import { PowerSchedulerGet } from "../power_scheduler/power_scheduler.get.entity";
import { PowerSchedulerService } from "../power_scheduler/power_scheduler.service";
import { Scheduler } from "../scheduler/scheduler.entity";
import { SchedulerGet } from "../scheduler/scheduler.get.entity";
import { SchedulerService } from "../scheduler/scheduler.service";
import { RepairItem } from "../repair_item/repair_item.entity";
import { RepairItemGet } from "../repair_item/repair_item.get.entity";
import { RepairItemService } from "../repair_item/repair_item.service";
import { Mail } from "../mail/mail.entity";
import { MailGet } from "../mail/mail.get.entity";
import { MailService } from "../mail/mail.service";


@Module({
  imports: [TypeOrmModule.forFeature([Device]), TypeOrmModule.forFeature([DeviceType]), TypeOrmModule.forFeature([DeviceTypeCategory]), TypeOrmModule.forFeature([DeviceConnection]), TypeOrmModule.forFeature([Domain]), TypeOrmModule.forFeature([PowerScheduler]), TypeOrmModule.forFeature([Scheduler]), TypeOrmModule.forFeature([RepairItem]), TypeOrmModule.forFeature([Mail])],
  //controllers: [DeviceController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, DeviceService, DevicesResolver, DeviceTypeService, DeviceTypeCategoryService, DeviceConnectionService, DomainService, PowerSchedulerService, SchedulerService, RepairItemService, MailService],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([Device])],
})
export class DeviceModule {}