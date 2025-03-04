import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairOrderController } from './repair_order.controller';
import { RepairOrdersResolver } from './repair_order.resolver';
import { RepairOrderService } from './repair_order.service';
import { RepairOrder } from './repair_order.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
import { Domain } from "../domain/domain.entity";
import { DomainGet } from "../domain/domain.get.entity";
import { DomainService } from "../domain/domain.service";
import { User } from "../user/user.entity";
import { UserGet } from "../user/user.get.entity";
import { UserService } from "../user/user.service";
import { RepairOrderHistory } from "../repair_order_history/repair_order_history.entity";
import { RepairOrderHistoryGet } from "../repair_order_history/repair_order_history.get.entity";
import { RepairOrderHistoryService } from "../repair_order_history/repair_order_history.service";
import { RepairItem } from "../repair_item/repair_item.entity";
import { RepairItemGet } from "../repair_item/repair_item.get.entity";
import { RepairItemService } from "../repair_item/repair_item.service";
import { RepairRecord } from "../repair_record/repair_record.entity";
import { RepairRecordGet } from "../repair_record/repair_record.get.entity";
import { RepairRecordService } from "../repair_record/repair_record.service";
import { Mail } from "../mail/mail.entity";
import { MailGet } from "../mail/mail.get.entity";
import { MailService } from "../mail/mail.service";


@Module({
  imports: [TypeOrmModule.forFeature([RepairOrder]), TypeOrmModule.forFeature([Domain]), TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([RepairOrderHistory]), TypeOrmModule.forFeature([RepairItem]), TypeOrmModule.forFeature([RepairRecord]), TypeOrmModule.forFeature([Mail])],
  //controllers: [RepairOrderController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, RepairOrderService, RepairOrdersResolver, DomainService, UserService, RepairOrderHistoryService, RepairItemService, RepairRecordService, MailService],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([RepairOrder])],
})
export class RepairOrderModule {}