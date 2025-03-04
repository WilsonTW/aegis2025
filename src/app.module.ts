import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './modules/user/user.service';
import { User } from './modules/user/user.entity';
import { DomainModule } from './modules/domain/domain.module';
import { RoleModule } from './modules/role/role.module';
import { DeviceTypeModule } from './modules/device_type/device_type.module';
import { DeviceModule } from './modules/device/device.module';
import { RepairOrderModule } from './modules/repair_order/repair_order.module';
import { RepairItemModule } from './modules/repair_item/repair_item.module';
import { RepairOrderHistoryModule } from './modules/repair_order_history/repair_order_history.module';
import { RepairRecordModule } from './modules/repair_record/repair_record.module';
import { RepairUserRecordModule } from './modules/repair_user_record/repair_user_record.module';
import { EventModule } from './modules/event/event.module';
import { SettingModule } from './modules/setting/setting.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataStorerManager } from './modules/data_storer/mqtt.service';
import { ExtraModule } from './modules/extra/extra.module';
import { DeviceConnectionModule } from './modules/device_connection/device_connection.module';
import { DomainService } from './modules/domain/domain.service';
import { DataStorerManagerModule } from './modules/data_storer/mqtt.module';
import { DeviceService } from './modules/device/device.service';
import { DeviceDataModule } from './modules/device_data/device_data.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MulterHelper } from './multer.helper';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppConfigService } from './app_config.service';
import { DeviceInput } from './modules/device_input/device_input.entity';
import { DeviceOutput } from './modules/device_output/device_output.entity';
import { DeviceInputModule } from './modules/device_input/device_input.module';
import { DeviceOutputModule } from './modules/device_output/device_output.module';
import { MailModule } from './modules/mail/mail.module';
import { MailService } from './modules/mail/mail.service';
import { SettingService } from './modules/setting/setting.service';
import { RoleService } from './modules/role/role.service';
import { DeviceTypeService } from './modules/device_type/device_type.service';
import { DeviceConnectionService } from './modules/device_connection/device_connection.service';
import { DeviceOutputService } from './modules/device_output/device_output.service';
import { DeviceInputService } from './modules/device_input/device_input.service';
import { SchedulerService } from './modules/scheduler/scheduler.service';
import { RepairTypeService } from './modules/repair_type/repair_type.service';
import { RepairOrderService } from './modules/repair_order/repair_order.service';
import { RepairItemService } from './modules/repair_item/repair_item.service';
import { RepairOrderHistoryService } from './modules/repair_order_history/repair_order_history.service';
import { RepairRecordService } from './modules/repair_record/repair_record.service';
import { RepairUserRecordService } from './modules/repair_user_record/repair_user_record.service';
import { EventService } from './modules/event/event.service';
import { AIQueryModule } from './modules/ai/aiquery.module';
import { AutoRunService } from './modules/autorun/autorun.service';
import { DeviceTypeCategoryModule } from './modules/device_type_category/device_type_category.module';
import { DeviceTypeCategoryService } from './modules/device_type_category/device_type_category.service';
import { PowerSchedulerService } from './modules/power_scheduler/power_scheduler.service';
import { PowerSchedulerModule } from './modules/power_scheduler/power_scheduler.module';
import { PagePermissionModule } from './modules/page_permission/page_permission.module';
import { PagePermissionService } from './modules/page_permission/page_permission.service';
import { Device } from './modules/device/device.entity';
import { DeviceDataService } from './modules/device_data/device_data.service';
import { PowerSchedulerExService } from './modules/power_scheduler/power_schedulerex.service';
import { Domain } from './modules/domain/domain.entity';
import { AuthService } from './modules/auth/auth.service';
import { AuthController } from './modules/auth/auth.controller';
import { SettingController } from './modules/setting/setting.controller';
import { DomainController } from './modules/domain/domain.controller';
import { RoleController } from './modules/role/role.controller';
import { PagePermissionController } from './modules/page_permission/page_permission.controller';
import { UserController } from './modules/user/user.controller';
import { DeviceTypeCategoryController } from './modules/device_type_category/device_type_category.controller';
import { DeviceTypeController } from './modules/device_type/device_type.controller';
import { DeviceConnectionController } from './modules/device_connection/device_connection.controller';
import { DeviceOutputController } from './modules/device_output/device_output.controller';
import { DeviceInputController } from './modules/device_input/device_input.controller';
import { DeviceController } from './modules/device/device.controller';
import { PowerSchedulerController } from './modules/power_scheduler/power_scheduler.controller';
import { SchedulerController } from './modules/scheduler/scheduler.controller';
import { RepairTypeController } from './modules/repair_type/repair_type.controller';
import { RepairOrderController } from './modules/repair_order/repair_order.controller';
import { RepairItemController } from './modules/repair_item/repair_item.controller';
import { RepairOrderHistoryController } from './modules/repair_order_history/repair_order_history.controller';
import { RepairRecordController } from './modules/repair_record/repair_record.controller';
import { RepairUserRecordController } from './modules/repair_user_record/repair_user_record.controller';
import { MailController } from './modules/mail/mail.controller';
import { EventController } from './modules/event/event.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { DeviceDataController, DeviceDataExController } from './modules/device_data/device_data.controller';
import { InfluxdbClientService } from './modules/device_data/influxdb_client.service';
import { DeviceReportService } from './modules/device_data/device_report.service';
import { DeviceDataPredictionService } from './modules/device_data/device_data_prediction.service';
import { SettingsResolver } from './modules/setting/setting.resolver';
import { DomainsResolver } from './modules/domain/domain.resolver';
import { RolesResolver } from './modules/role/role.resolver';
import { PagePermissionsResolver } from './modules/page_permission/page_permission.resolver';
import { UsersResolver } from './modules/user/user.resolver';
import { DeviceTypeCategorysResolver } from './modules/device_type_category/device_type_category.resolver';
import { DeviceTypesResolver } from './modules/device_type/device_type.resolver';
import { DeviceConnectionsResolver } from './modules/device_connection/device_connection.resolver';
import { DeviceOutputsResolver } from './modules/device_output/device_output.resolver';
import { DeviceInputsResolver } from './modules/device_input/device_input.resolver';
import { DevicesResolver } from './modules/device/device.resolver';
import { PowerSchedulersResolver } from './modules/power_scheduler/power_scheduler.resolver';
import { SchedulersResolver } from './modules/scheduler/scheduler.resolver';
import { RepairTypesResolver } from './modules/repair_type/repair_type.resolver';
import { RepairOrdersResolver } from './modules/repair_order/repair_order.resolver';
import { RepairItemsResolver } from './modules/repair_item/repair_item.resolver';
import { RepairOrderHistorysResolver } from './modules/repair_order_history/repair_order_history.resolver';
import { RepairRecordsResolver } from './modules/repair_record/repair_record.resolver';
import { RepairUserRecordsResolver } from './modules/repair_user_record/repair_user_record.resolver';
import { MailsResolver } from './modules/mail/mail.resolver';
import { EventsResolver } from './modules/event/event.resolver';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './modules/auth/auth.resolver';
import { LocalStrategy } from './modules/auth/local.strategy';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { PhoneNotifyDto } from './app.entity';

const path = require('path');

@Module({
  imports: [


    ConfigModule.forRoot(), // 加入 ConfigModule 以使用環境變數


    ScheduleModule.forRoot(),

    TypeOrmModule.forRoot(AppConfigService.getDatabaseConfig()),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ req }),  // 把 req 物件傳遞到 GraphQL 上下文中
      debug: false,
      formatError: (error) => {
        let test_mode = AppConfigService.getSystemConfig().test_mode
        test_mode = false
        if (!test_mode) {
          // 只返回簡單的錯誤消息
          var extensions2 = Object.assign({}, error.extensions)
          delete extensions2.stacktrace
          return {
            message: error.message,
            extensions: extensions2,
            //stack: error.stack,
          };
        }
        // 開發環境返回更多的錯誤細節
        return error
      }
      
    }),

    /*
    MulterModule.register({
      storage: diskStorage({
        destination: MulterHelper.destination,
        filename: MulterHelper.filenameHandler
      })
    }),
    */

    //TypeOrmModule.forFeature([User])

    AuthModule,
    ExtraModule,

    SettingModule,
    UserModule,
    DomainModule,
    RoleModule,
    PagePermissionModule,
    DeviceTypeCategoryModule,
    DeviceTypeModule,
    DeviceConnectionModule,
    DeviceModule,
    RepairItemModule,
    RepairOrderHistoryModule,
    RepairRecordModule,
    RepairUserRecordModule,
    MailModule,
    EventModule,

    DeviceInputModule,
    DeviceOutputModule,
    DeviceDataModule,
    PowerSchedulerModule,

    RepairOrderModule,
    
    DataStorerManagerModule,
    //AIQueryModule,

    ServeStaticModule.forRoot({
      rootPath: AppConfigService.getSystemConfig().static_page_path,
    }),

    TypeOrmModule.forFeature([Domain]),
    TypeOrmModule.forFeature([Device]),

    TypeOrmModule.forFeature([PhoneNotifyDto])



    /*
    //ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: 'xzxxxxxxxxxx', // configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '3h' }, // Adjust the expiration time as needed
      }),
      inject: [ConfigService],
    }),
    */
    /*
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async function(configService: ConfigService) {
        return {
          secret: 'kb9045gj0v9wj4r50jgtw05r4tg', // configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '60s' }
        }
      },
    }),
    */
    /*
    JwtModule.register({
      secret: 'aakiga0e934u0t9quj4039qt', // 這裡的 secret 必須有值
      signOptions: { expiresIn: '60s' },
    }),
    */

  ],
  controllers: [
    AppController,
    //AuthController,
    DeviceDataController,
    DeviceDataExController,

    SettingController,
    DomainController,
    RoleController,
    PagePermissionController,
    UserController,
    DeviceTypeCategoryController,
    DeviceTypeController,
    DeviceConnectionController,
    DeviceOutputController,
    DeviceInputController,
    DeviceController,
    PowerSchedulerController,
    SchedulerController,
    RepairTypeController,
    RepairOrderController,
    RepairItemController,
    RepairOrderHistoryController,
    RepairRecordController,
    RepairUserRecordController,
    MailController,
    EventController,    
  ],
  providers: [

    //AuthService,
    //JwtService,
    //LocalStrategy,
    //JwtStrategy,

    //AuthResolver,

    AppService,

    AutoRunService,
    DeviceDataService,
    InfluxdbClientService,
    DeviceReportService,
    DeviceDataPredictionService,
    PowerSchedulerExService,
    DataStorerManager,
  
    SettingService,
    DomainService,
    RoleService,
    PagePermissionService,
    UserService,
    DeviceTypeCategoryService,
    DeviceTypeService,
    DeviceConnectionService,
    DeviceOutputService,
    DeviceInputService,
    DeviceService,
    PowerSchedulerService,
    SchedulerService,
    RepairTypeService,
    RepairOrderService,
    RepairItemService,
    RepairOrderHistoryService,
    RepairRecordService,
    RepairUserRecordService,
    MailService,
    EventService,

    SettingsResolver,
    DomainsResolver,
    RolesResolver,
    PagePermissionsResolver,
    UsersResolver,
    DeviceTypeCategorysResolver,
    DeviceTypesResolver,
    DeviceConnectionsResolver,
    DeviceOutputsResolver,
    DeviceInputsResolver,
    DevicesResolver,
    PowerSchedulersResolver,
    SchedulersResolver,
    RepairTypesResolver,
    RepairOrdersResolver,
    RepairItemsResolver,
    RepairOrderHistorysResolver,
    RepairRecordsResolver,
    RepairUserRecordsResolver,
    MailsResolver,
    EventsResolver,

  ],
})
export class AppModule {
  constructor() {}
}
