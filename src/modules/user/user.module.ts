import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UsersResolver } from './user.resolver';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
import { Domain } from "../domain/domain.entity";
import { DomainGet } from "../domain/domain.get.entity";
import { DomainService } from "../domain/domain.service";
import { Role } from "../role/role.entity";
import { RoleGet } from "../role/role.get.entity";
import { RoleService } from "../role/role.service";
import { PowerScheduler } from "../power_scheduler/power_scheduler.entity";
import { PowerSchedulerGet } from "../power_scheduler/power_scheduler.get.entity";
import { PowerSchedulerService } from "../power_scheduler/power_scheduler.service";
import { RepairOrder } from "../repair_order/repair_order.entity";
import { RepairOrderGet } from "../repair_order/repair_order.get.entity";
import { RepairOrderService } from "../repair_order/repair_order.service";
import { RepairOrderHistory } from "../repair_order_history/repair_order_history.entity";
import { RepairOrderHistoryGet } from "../repair_order_history/repair_order_history.get.entity";
import { RepairOrderHistoryService } from "../repair_order_history/repair_order_history.service";
import { RepairUserRecord } from "../repair_user_record/repair_user_record.entity";
import { RepairUserRecordGet } from "../repair_user_record/repair_user_record.get.entity";
import { RepairUserRecordService } from "../repair_user_record/repair_user_record.service";
import { Mail } from "../mail/mail.entity";
import { MailGet } from "../mail/mail.get.entity";
import { MailService } from "../mail/mail.service";


@Module({
  imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Domain]), TypeOrmModule.forFeature([Role]), TypeOrmModule.forFeature([PowerScheduler]), TypeOrmModule.forFeature([RepairOrder]), TypeOrmModule.forFeature([RepairOrderHistory]), TypeOrmModule.forFeature([RepairUserRecord]), TypeOrmModule.forFeature([Mail])],
  //controllers: [UserController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, UserService, UsersResolver, DomainService, RoleService, PowerSchedulerService, RepairOrderService, RepairOrderHistoryService, RepairUserRecordService, MailService],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}