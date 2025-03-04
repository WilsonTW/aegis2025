import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UsersResolver } from './user.resolver';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserPermission } from "../user_permission/user_permission.entity";
import { UserPermissionService } from "../user_permission/user_permission.service";
import { RepairOrderHistory } from "../repair_order_history/repair_order_history.entity";
import { RepairOrderHistoryService } from "../repair_order_history/repair_order_history.service";
import { RepairUserRecord } from "../repair_user_record/repair_user_record.entity";
import { RepairUserRecordService } from "../repair_user_record/repair_user_record.service";


@Module({
  imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([UserPermission]), TypeOrmModule.forFeature([RepairOrderHistory]), TypeOrmModule.forFeature([RepairUserRecord])],
  controllers: [UserController],
  providers: [UserService, UsersResolver, UserPermissionService, RepairOrderHistoryService, RepairUserRecordService],
  exports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}