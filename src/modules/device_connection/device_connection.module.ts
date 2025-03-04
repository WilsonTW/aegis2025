import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceConnectionController } from './device_connection.controller';
import { DeviceConnectionsResolver } from './device_connection.resolver';
import { DeviceConnectionService } from './device_connection.service';
import { DeviceConnection } from './device_connection.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeGet } from "../device_type/device_type.get.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { Domain } from "../domain/domain.entity";
import { DomainGet } from "../domain/domain.get.entity";
import { DomainService } from "../domain/domain.service";
import { Device } from "../device/device.entity";
import { DeviceGet } from "../device/device.get.entity";
import { DeviceService } from "../device/device.service";


@Module({
  imports: [TypeOrmModule.forFeature([DeviceConnection]), TypeOrmModule.forFeature([DeviceType]), TypeOrmModule.forFeature([Domain]), TypeOrmModule.forFeature([Device])],
  //controllers: [DeviceConnectionController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, DeviceConnectionService, DeviceConnectionsResolver, DeviceTypeService, DomainService, DeviceService],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([DeviceConnection])],
})
export class DeviceConnectionModule {}