import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainModule } from '../domain/domain.module';
import { DomainService } from '../domain/domain.service';
import { DeviceService } from '../device/device.service';
import { DeviceModule } from '../device/device.module';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { AIQueryController } from './aiquery.controller';
import { AIQueryService } from './aiquery.service';
import { DeviceTypeService } from '../device_type/device_type.service';
import { DeviceTypeModule } from '../device_type/device_type.module';


@Module({
  imports: [DomainModule, DeviceTypeModule, DeviceModule, UserModule],
  controllers: [AIQueryController],
  providers: [AIQueryService, UserService, DomainService, DeviceTypeService, DeviceService],
  exports: [AIQueryService],
})
export class AIQueryModule {}