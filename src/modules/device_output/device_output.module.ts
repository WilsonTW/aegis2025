import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceOutputController } from './device_output.controller';
import { DeviceOutputsResolver } from './device_output.resolver';
import { DeviceOutputService } from './device_output.service';
import { DeviceOutput } from './device_output.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeGet } from "../device_type/device_type.get.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { DeviceInput } from "../device_input/device_input.entity";
import { DeviceInputGet } from "../device_input/device_input.get.entity";
import { DeviceInputService } from "../device_input/device_input.service";
import { Event } from "../event/event.entity";
import { EventGet } from "../event/event.get.entity";
import { EventService } from "../event/event.service";


@Module({
  imports: [TypeOrmModule.forFeature([DeviceOutput]), TypeOrmModule.forFeature([DeviceType]), TypeOrmModule.forFeature([DeviceInput]), TypeOrmModule.forFeature([Event])],
  //controllers: [DeviceOutputController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, DeviceOutputService, DeviceOutputsResolver, DeviceTypeService, DeviceInputService, EventService],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([DeviceOutput])],
})
export class DeviceOutputModule {}