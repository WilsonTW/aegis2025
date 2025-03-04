import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceMeterController } from './device_meter.controller';
import { DeviceMetersResolver } from './device_meter.resolver';
import { DeviceMeterService } from './device_meter.service';
import { DeviceMeter } from './device_meter.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
//--- @(reference_import) ---

@Module({
  imports: [TypeOrmModule.forFeature([DeviceMeter])/* @(module_imports) */],
  //controllers: [DeviceMeterController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, DeviceMeterService, DeviceMetersResolver/* @(module_providers) */],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([DeviceMeter])],
})
export class DeviceMeterModule {}