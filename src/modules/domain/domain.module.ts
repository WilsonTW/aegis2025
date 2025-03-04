import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainController } from './domain.controller';
import { DomainsResolver } from './domain.resolver';
import { DomainService } from './domain.service';
import { Domain } from './domain.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
import { Role } from "../role/role.entity";
import { RoleGet } from "../role/role.get.entity";
import { RoleService } from "../role/role.service";
import { User } from "../user/user.entity";
import { UserGet } from "../user/user.get.entity";
import { UserService } from "../user/user.service";
import { DeviceConnection } from "../device_connection/device_connection.entity";
import { DeviceConnectionGet } from "../device_connection/device_connection.get.entity";
import { DeviceConnectionService } from "../device_connection/device_connection.service";
import { Device } from "../device/device.entity";
import { DeviceGet } from "../device/device.get.entity";
import { DeviceService } from "../device/device.service";
import { PowerScheduler } from "../power_scheduler/power_scheduler.entity";
import { PowerSchedulerGet } from "../power_scheduler/power_scheduler.get.entity";
import { PowerSchedulerService } from "../power_scheduler/power_scheduler.service";
import { Scheduler } from "../scheduler/scheduler.entity";
import { SchedulerGet } from "../scheduler/scheduler.get.entity";
import { SchedulerService } from "../scheduler/scheduler.service";
import { RepairOrder } from "../repair_order/repair_order.entity";
import { RepairOrderGet } from "../repair_order/repair_order.get.entity";
import { RepairOrderService } from "../repair_order/repair_order.service";
import { Event } from "../event/event.entity";
import { EventGet } from "../event/event.get.entity";
import { EventService } from "../event/event.service";


@Module({
  imports: [TypeOrmModule.forFeature([Domain]), TypeOrmModule.forFeature([Role]), TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([DeviceConnection]), TypeOrmModule.forFeature([Device]), TypeOrmModule.forFeature([PowerScheduler]), TypeOrmModule.forFeature([Scheduler]), TypeOrmModule.forFeature([RepairOrder]), TypeOrmModule.forFeature([Event])],
  //controllers: [DomainController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, DomainService, DomainsResolver, RoleService, UserService, DeviceConnectionService, DeviceService, PowerSchedulerService, SchedulerService, RepairOrderService, EventService],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([Domain])],
})
export class DomainModule {}