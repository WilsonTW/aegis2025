import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context, ArgsType, Field, ObjectType } from "@nestjs/graphql";

import { User } from './user.entity';
import { Setting } from "../setting/setting.entity";
import { SettingService } from "../setting/setting.service";
import { Domain } from "../domain/domain.entity";
import { DomainService } from "../domain/domain.service";
import { Role } from "../role/role.entity";
import { RoleService } from "../role/role.service";
import { PagePermission } from "../page_permission/page_permission.entity";
import { PagePermissionService } from "../page_permission/page_permission.service";
import { DeviceTypeCategory } from "../device_type_category/device_type_category.entity";
import { DeviceTypeCategoryService } from "../device_type_category/device_type_category.service";
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { DeviceConnection } from "../device_connection/device_connection.entity";
import { DeviceConnectionService } from "../device_connection/device_connection.service";
import { DeviceOutput } from "../device_output/device_output.entity";
import { DeviceOutputService } from "../device_output/device_output.service";
import { DeviceInput } from "../device_input/device_input.entity";
import { DeviceInputService } from "../device_input/device_input.service";
import { Device } from "../device/device.entity";
import { DeviceService } from "../device/device.service";
import { PowerScheduler } from "../power_scheduler/power_scheduler.entity";
import { PowerSchedulerService } from "../power_scheduler/power_scheduler.service";
import { Scheduler } from "../scheduler/scheduler.entity";
import { SchedulerService } from "../scheduler/scheduler.service";
import { RepairType } from "../repair_type/repair_type.entity";
import { RepairTypeService } from "../repair_type/repair_type.service";
import { RepairOrder } from "../repair_order/repair_order.entity";
import { RepairOrderService } from "../repair_order/repair_order.service";
import { RepairItem } from "../repair_item/repair_item.entity";
import { RepairItemService } from "../repair_item/repair_item.service";
import { RepairOrderHistory } from "../repair_order_history/repair_order_history.entity";
import { RepairOrderHistoryService } from "../repair_order_history/repair_order_history.service";
import { RepairRecord } from "../repair_record/repair_record.entity";
import { RepairRecordService } from "../repair_record/repair_record.service";
import { RepairUserRecord } from "../repair_user_record/repair_user_record.entity";
import { RepairUserRecordService } from "../repair_user_record/repair_user_record.service";
import { Mail } from "../mail/mail.entity";
import { MailService } from "../mail/mail.service";
import { Event } from "../event/event.entity";
import { EventService } from "../event/event.service";

import { UsersResolverBase } from "./user.resolver.base";
import { UserService } from "./user.service";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetUserArgs } from "./user.args";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";
import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { UserGet } from "./user.get.entity";

@Resolver(of => UserGet)
export class UsersResolver extends UsersResolverBase {
  constructor(
    public readonly userService: UserService,
    public readonly domainService: DomainService,
    public readonly roleService: RoleService,
    public readonly powerSchedulerService: PowerSchedulerService,
    public readonly repairOrderService: RepairOrderService,
    public readonly repairOrderHistoryService: RepairOrderHistoryService,
    public readonly repairUserRecordService: RepairUserRecordService,
    public readonly mailService: MailService,

  ) {
    super(userService, domainService, roleService, powerSchedulerService, repairOrderService, repairOrderHistoryService, repairUserRecordService, mailService)
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns => [UserGet])
  users(
    @Context() context,
    @Args() args: GetUserArgs
    //parent, args, contextValue, info
  ): Promise<UserGet[]> {
    var service:any = this.userService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    if (args==null || Object.keys(args).length==0) {
      return findAll(context.req?.user);
    } else {
      return findAll(context.req?.user, {
        where: args,
      });
    }
  }


  @UseGuards(GqlAuthGuard)
  @Query(returns => UserGet, { nullable: true })
  async user(@Context() context, @Args('user_id', {type:()=>Int}) user_id:number):Promise<UserGet|null> {
    var service:any = this.userService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    var user = await findOne(context.req?.user, user_id);
    return user
  }

}