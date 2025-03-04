import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagePermissionController } from './page_permission.controller';
import { PagePermissionsResolver } from './page_permission.resolver';
import { PagePermissionService } from './page_permission.service';
import { PagePermission } from './page_permission.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';


@Module({
  imports: [TypeOrmModule.forFeature([PagePermission])],
  //controllers: [PagePermissionController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, PagePermissionService, PagePermissionsResolver],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([PagePermission])],
})
export class PagePermissionModule {}