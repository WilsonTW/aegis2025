import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceTypeCategoryController } from './device_type_category.controller';
import { DeviceTypeCategorysResolver } from './device_type_category.resolver';
import { DeviceTypeCategoryService } from './device_type_category.service';
import { DeviceTypeCategory } from './device_type_category.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeGet } from "../device_type/device_type.get.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { Device } from "../device/device.entity";
import { DeviceGet } from "../device/device.get.entity";
import { DeviceService } from "../device/device.service";


@Module({
  imports: [TypeOrmModule.forFeature([DeviceTypeCategory]), TypeOrmModule.forFeature([DeviceType]), TypeOrmModule.forFeature([Device])],
  //controllers: [DeviceTypeCategoryController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, DeviceTypeCategoryService, DeviceTypeCategorysResolver, DeviceTypeService, DeviceService],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([DeviceTypeCategory])],
})
export class DeviceTypeCategoryModule {}