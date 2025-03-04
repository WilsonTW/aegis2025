import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { EventsResolver } from './event.resolver';
import { EventService } from './event.service';
import { Event } from './event.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
import { Domain } from "../domain/domain.entity";
import { DomainGet } from "../domain/domain.get.entity";
import { DomainService } from "../domain/domain.service";
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeGet } from "../device_type/device_type.get.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { DeviceOutput } from "../device_output/device_output.entity";
import { DeviceOutputGet } from "../device_output/device_output.get.entity";
import { DeviceOutputService } from "../device_output/device_output.service";


@Module({
  imports: [TypeOrmModule.forFeature([Event]), TypeOrmModule.forFeature([Domain]), TypeOrmModule.forFeature([DeviceType]), TypeOrmModule.forFeature([DeviceOutput])],
  //controllers: [EventController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, EventService, EventsResolver, DomainService, DeviceTypeService, DeviceOutputService],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([Event])],
})
export class EventModule {}