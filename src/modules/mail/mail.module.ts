import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailController } from './mail.controller';
import { MailsResolver } from './mail.resolver';
import { MailService } from './mail.service';
import { Mail } from './mail.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
import { User } from "../user/user.entity";
import { UserGet } from "../user/user.get.entity";
import { UserService } from "../user/user.service";
import { RepairOrder } from "../repair_order/repair_order.entity";
import { RepairOrderGet } from "../repair_order/repair_order.get.entity";
import { RepairOrderService } from "../repair_order/repair_order.service";
import { Device } from "../device/device.entity";
import { DeviceGet } from "../device/device.get.entity";
import { DeviceService } from "../device/device.service";


@Module({
  imports: [TypeOrmModule.forFeature([Mail]), TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([RepairOrder]), TypeOrmModule.forFeature([Device])],
  //controllers: [MailController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, MailService, MailsResolver, UserService, RepairOrderService, DeviceService],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([Mail])],
})
export class MailModule {}