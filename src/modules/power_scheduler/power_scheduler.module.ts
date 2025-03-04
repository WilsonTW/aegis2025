import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PowerSchedulerController } from './power_scheduler.controller';
import { PowerSchedulersResolver } from './power_scheduler.resolver';
import { PowerSchedulerService } from './power_scheduler.service';
import { PowerScheduler } from './power_scheduler.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
import { Domain } from "../domain/domain.entity";
import { DomainGet } from "../domain/domain.get.entity";
import { DomainService } from "../domain/domain.service";
import { Device } from "../device/device.entity";
import { DeviceGet } from "../device/device.get.entity";
import { DeviceService } from "../device/device.service";
import { User } from "../user/user.entity";
import { UserGet } from "../user/user.get.entity";
import { UserService } from "../user/user.service";


@Module({
  imports: [TypeOrmModule.forFeature([PowerScheduler]), TypeOrmModule.forFeature([Domain]), TypeOrmModule.forFeature([Device]), TypeOrmModule.forFeature([User])],
  //controllers: [PowerSchedulerController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, PowerSchedulerService, PowerSchedulersResolver, DomainService, DeviceService, UserService],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([PowerScheduler])],
})
export class PowerSchedulerModule {}