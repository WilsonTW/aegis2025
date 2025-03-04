import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceDataService } from './device_data.service';
import { DeviceDataController, DeviceDataExController } from './device_data.controller';
import { InfluxdbClientService } from './influxdb_client.service';
import { DomainModule } from '../domain/domain.module';
import { DeviceOutputModule } from '../device_output/device_output.module';
import { DomainService } from '../domain/domain.service';
import { DeviceService } from '../device/device.service';
import { DeviceModule } from '../device/device.module';
import { DeviceOutputService } from '../device_output/device_output.service';
import { DeviceTypeService } from '../device_type/device_type.service';
import { AppService } from 'src/app.service';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { MailService } from '../mail/mail.service';
import { MailModule } from '../mail/mail.module';
import { EventService } from '../event/event.service';
import { EventModule } from '../event/event.module';
import { DeviceDataPredictionService } from './device_data_prediction.service';
import { DeviceReportService } from './device_report.service';
import { DeviceTypeCategoryService } from '../device_type_category/device_type_category.service';

@Module({
  imports: [DomainModule, DeviceModule, DeviceOutputModule, UserModule, MailModule, EventModule],
  //controllers: [DeviceDataController, DeviceDataExController],
  //providers: [DeviceDataService, DeviceDataPredictionService, DeviceReportService, AppService, UserService, MailService, DomainService, DeviceTypeCategoryService, DeviceTypeService, DeviceExService, DeviceOutputService, EventService, InfluxdbClientService],
  controllers: [],
  providers: [],
  exports: [],
})
export class DeviceDataModule {}