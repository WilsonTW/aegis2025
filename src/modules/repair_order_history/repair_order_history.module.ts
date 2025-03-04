import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairOrderHistoryController } from './repair_order_history.controller';
import { RepairOrderHistorysResolver } from './repair_order_history.resolver';
import { RepairOrderHistoryService } from './repair_order_history.service';
import { RepairOrderHistory } from './repair_order_history.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
import { RepairOrder } from "../repair_order/repair_order.entity";
import { RepairOrderGet } from "../repair_order/repair_order.get.entity";
import { RepairOrderService } from "../repair_order/repair_order.service";
import { User } from "../user/user.entity";
import { UserGet } from "../user/user.get.entity";
import { UserService } from "../user/user.service";


@Module({
  imports: [TypeOrmModule.forFeature([RepairOrderHistory]), TypeOrmModule.forFeature([RepairOrder]), TypeOrmModule.forFeature([User])],
  //controllers: [RepairOrderHistoryController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, RepairOrderHistoryService, RepairOrderHistorysResolver, RepairOrderService, UserService],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([RepairOrderHistory])],
})
export class RepairOrderHistoryModule {}