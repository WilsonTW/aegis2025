import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairRecordController } from './repair_record.controller';
import { RepairRecordsResolver } from './repair_record.resolver';
import { RepairRecordService } from './repair_record.service';
import { RepairRecord } from './repair_record.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
import { RepairOrder } from "../repair_order/repair_order.entity";
import { RepairOrderGet } from "../repair_order/repair_order.get.entity";
import { RepairOrderService } from "../repair_order/repair_order.service";
import { RepairItem } from "../repair_item/repair_item.entity";
import { RepairItemGet } from "../repair_item/repair_item.get.entity";
import { RepairItemService } from "../repair_item/repair_item.service";
import { RepairUserRecord } from "../repair_user_record/repair_user_record.entity";
import { RepairUserRecordGet } from "../repair_user_record/repair_user_record.get.entity";
import { RepairUserRecordService } from "../repair_user_record/repair_user_record.service";


@Module({
  imports: [TypeOrmModule.forFeature([RepairRecord]), TypeOrmModule.forFeature([RepairOrder]), TypeOrmModule.forFeature([RepairItem]), TypeOrmModule.forFeature([RepairUserRecord])],
  //controllers: [RepairRecordController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, RepairRecordService, RepairRecordsResolver, RepairOrderService, RepairItemService, RepairUserRecordService],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([RepairRecord])],
})
export class RepairRecordModule {}