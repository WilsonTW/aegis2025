import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairItemController } from './repair_item.controller';
import { RepairItemsResolver } from './repair_item.resolver';
import { RepairItemService } from './repair_item.service';
import { RepairItem } from './repair_item.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
import { RepairType } from "../repair_type/repair_type.entity";
import { RepairTypeGet } from "../repair_type/repair_type.get.entity";
import { RepairTypeService } from "../repair_type/repair_type.service";
import { RepairOrder } from "../repair_order/repair_order.entity";
import { RepairOrderGet } from "../repair_order/repair_order.get.entity";
import { RepairOrderService } from "../repair_order/repair_order.service";
import { Device } from "../device/device.entity";
import { DeviceGet } from "../device/device.get.entity";
import { DeviceService } from "../device/device.service";
import { RepairRecord } from "../repair_record/repair_record.entity";
import { RepairRecordGet } from "../repair_record/repair_record.get.entity";
import { RepairRecordService } from "../repair_record/repair_record.service";


@Module({
  imports: [TypeOrmModule.forFeature([RepairItem]), TypeOrmModule.forFeature([RepairType]), TypeOrmModule.forFeature([RepairOrder]), TypeOrmModule.forFeature([Device]), TypeOrmModule.forFeature([RepairRecord])],
  //controllers: [RepairItemController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, RepairItemService, RepairItemsResolver, RepairTypeService, RepairOrderService, DeviceService, RepairRecordService],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([RepairItem])],
})
export class RepairItemModule {}