import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingController } from './setting.controller';
import { SettingsResolver } from './setting.resolver';
import { SettingService } from './setting.service';
import { Setting } from './setting.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';


@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  //controllers: [SettingController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, SettingService, SettingsResolver],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([Setting])],
})
export class SettingModule {}