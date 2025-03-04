import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceInputController } from './device_input.controller';
import { DeviceInputsResolver } from './device_input.resolver';
import { DeviceInputService } from './device_input.service';
import { DeviceInput } from './device_input.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeGet } from "../device_type/device_type.get.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { DeviceOutput } from "../device_output/device_output.entity";
import { DeviceOutputGet } from "../device_output/device_output.get.entity";
import { DeviceOutputService } from "../device_output/device_output.service";
import { Scheduler } from "../scheduler/scheduler.entity";
import { SchedulerGet } from "../scheduler/scheduler.get.entity";
import { SchedulerService } from "../scheduler/scheduler.service";


@Module({
  imports: [TypeOrmModule.forFeature([DeviceInput]), TypeOrmModule.forFeature([DeviceType]), TypeOrmModule.forFeature([DeviceOutput]), TypeOrmModule.forFeature([Scheduler])],
  //controllers: [DeviceInputController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, DeviceInputService, DeviceInputsResolver, DeviceTypeService, DeviceOutputService, SchedulerService],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([DeviceInput])],
})
export class DeviceInputModule {}