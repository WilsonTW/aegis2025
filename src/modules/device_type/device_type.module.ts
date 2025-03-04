import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceTypeController } from './device_type.controller';
import { DeviceTypesResolver } from './device_type.resolver';
import { DeviceTypeService } from './device_type.service';
import { DeviceType } from './device_type.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
import { DeviceTypeCategory } from "../device_type_category/device_type_category.entity";
import { DeviceTypeCategoryGet } from "../device_type_category/device_type_category.get.entity";
import { DeviceTypeCategoryService } from "../device_type_category/device_type_category.service";
import { DeviceConnection } from "../device_connection/device_connection.entity";
import { DeviceConnectionGet } from "../device_connection/device_connection.get.entity";
import { DeviceConnectionService } from "../device_connection/device_connection.service";
import { DeviceOutput } from "../device_output/device_output.entity";
import { DeviceOutputGet } from "../device_output/device_output.get.entity";
import { DeviceOutputService } from "../device_output/device_output.service";
import { DeviceInput } from "../device_input/device_input.entity";
import { DeviceInputGet } from "../device_input/device_input.get.entity";
import { DeviceInputService } from "../device_input/device_input.service";
import { Device } from "../device/device.entity";
import { DeviceGet } from "../device/device.get.entity";
import { DeviceService } from "../device/device.service";
import { Scheduler } from "../scheduler/scheduler.entity";
import { SchedulerGet } from "../scheduler/scheduler.get.entity";
import { SchedulerService } from "../scheduler/scheduler.service";
import { RepairType } from "../repair_type/repair_type.entity";
import { RepairTypeGet } from "../repair_type/repair_type.get.entity";
import { RepairTypeService } from "../repair_type/repair_type.service";
import { Event } from "../event/event.entity";
import { EventGet } from "../event/event.get.entity";
import { EventService } from "../event/event.service";


@Module({
  imports: [TypeOrmModule.forFeature([DeviceType]), TypeOrmModule.forFeature([DeviceTypeCategory]), TypeOrmModule.forFeature([DeviceConnection]), TypeOrmModule.forFeature([DeviceOutput]), TypeOrmModule.forFeature([DeviceInput]), TypeOrmModule.forFeature([Device]), TypeOrmModule.forFeature([Scheduler]), TypeOrmModule.forFeature([RepairType]), TypeOrmModule.forFeature([Event])],
  //controllers: [DeviceTypeController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, DeviceTypeService, DeviceTypesResolver, DeviceTypeCategoryService, DeviceConnectionService, DeviceOutputService, DeviceInputService, DeviceService, SchedulerService, RepairTypeService, EventService],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([DeviceType])],
})
export class DeviceTypeModule {}