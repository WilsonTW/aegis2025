import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairUserRecordController } from './repair_user_record.controller';
import { RepairUserRecordsResolver } from './repair_user_record.resolver';
import { RepairUserRecordService } from './repair_user_record.service';
import { RepairUserRecord } from './repair_user_record.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
import { RepairRecord } from "../repair_record/repair_record.entity";
import { RepairRecordGet } from "../repair_record/repair_record.get.entity";
import { RepairRecordService } from "../repair_record/repair_record.service";
import { User } from "../user/user.entity";
import { UserGet } from "../user/user.get.entity";
import { UserService } from "../user/user.service";


@Module({
  imports: [TypeOrmModule.forFeature([RepairUserRecord]), TypeOrmModule.forFeature([RepairRecord]), TypeOrmModule.forFeature([User])],
  //controllers: [RepairUserRecordController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, RepairUserRecordService, RepairUserRecordsResolver, RepairRecordService, UserService],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([RepairUserRecord])],
})
export class RepairUserRecordModule {}