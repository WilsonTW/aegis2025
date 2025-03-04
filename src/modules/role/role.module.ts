import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RolesResolver } from './role.resolver';
import { RoleService } from './role.service';
import { Role } from './role.entity';
import { AppService } from 'src/app.service';
import { InfluxdbClientService } from 'src/modules/device_data/influxdb_client.service';
import { DeviceDataService } from 'src/modules/device_data/device_data.service';
import { Domain } from "../domain/domain.entity";
import { DomainGet } from "../domain/domain.get.entity";
import { DomainService } from "../domain/domain.service";
import { User } from "../user/user.entity";
import { UserGet } from "../user/user.get.entity";
import { UserService } from "../user/user.service";


@Module({
  imports: [TypeOrmModule.forFeature([Role]), TypeOrmModule.forFeature([Domain]), TypeOrmModule.forFeature([User])],
  //controllers: [RoleController],
  //providers: [AppService, InfluxdbClientService, DeviceDataService, RoleService, RolesResolver, DomainService, UserService],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule.forFeature([Role])],
})
export class RoleModule {}