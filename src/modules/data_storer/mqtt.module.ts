import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from "../role/role.entity";
import { RoleService } from "../role/role.service";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { Device } from "../device/device.entity";
import { DeviceService } from "../device/device.service";
import { DeviceConnection } from "../device_connection/device_connection.entity";
import { DeviceConnectionService } from "../device_connection/device_connection.service";
import { RepairOrder } from "../repair_order/repair_order.entity";
import { RepairOrderService } from "../repair_order/repair_order.service";
import { DataStorerManager } from './mqtt.service';
import { Domain } from '../domain/domain.entity';
import { DomainService } from '../domain/domain.service';
import { DeviceInput } from '../device_input/device_input.entity';
import { DeviceOutput } from '../device_output/device_output.entity';
import { InfluxdbClientService } from '../device_data/influxdb_client.service';
import { MailService } from '../mail/mail.service';
import { EventService } from '../event/event.service';
import { Mail } from '../mail/mail.entity';
import { Event } from '../event/event.entity';
import { AppService } from '../../app.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Domain]),
    TypeOrmModule.forFeature([Device]),
    TypeOrmModule.forFeature([DeviceInput]),
    TypeOrmModule.forFeature([DeviceOutput]),
    TypeOrmModule.forFeature([DeviceConnection]),
    TypeOrmModule.forFeature([Mail]),
    TypeOrmModule.forFeature([Event]),
    TypeOrmModule.forFeature([DeviceType]),
  ],
  controllers: [],
  //providers: [DataStorerManager, AppService, UserService, DomainService, MailService, EventService, DeviceExService, DeviceTypeService, InfluxdbClientService],
  providers: [],
  exports: [],
})
export class DataStorerManagerModule {}