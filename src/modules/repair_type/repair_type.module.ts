import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairTypeController } from './repair_type.controller';
import { RepairTypesResolver } from './repair_type.resolver';
import { RepairTypeService } from './repair_type.service';
import { RepairType } from './repair_type.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeGet } from "../device_type/device_type.get.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { RepairItem } from "../repair_item/repair_item.entity";
import { RepairItemGet } from "../repair_item/repair_item.get.entity";
import { RepairItemService } from "../repair_item/repair_item.service";


@Module({
  imports: [TypeOrmModule.forFeature([RepairType]), TypeOrmModule.forFeature([DeviceType]), TypeOrmModule.forFeature([RepairItem])],
  //controllers: [RepairTypeController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, RepairTypeService, RepairTypesResolver, DeviceTypeService, RepairItemService],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([RepairType])],
})
export class RepairTypeModule {}