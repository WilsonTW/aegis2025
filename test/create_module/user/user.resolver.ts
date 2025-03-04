import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { User } from './user.entity';
import { UserPermission } from "../user_permission/user_permission.entity";
import { UserPermissionService } from "../user_permission/user_permission.service";
import { RepairOrderHistory } from "../repair_order_history/repair_order_history.entity";
import { RepairOrderHistoryService } from "../repair_order_history/repair_order_history.service";
import { RepairUserRecord } from "../repair_user_record/repair_user_record.entity";
import { RepairUserRecordService } from "../repair_user_record/repair_user_record.service";

import { UsersResolverBase } from "./user.resolver.base";
import { UserService } from "./user.service";

@Resolver(of => UserGet)
export class UsersResolver extends UsersResolverBase {
  constructor(
    public readonly userService: UserService,
    public readonly userPermissionService: UserPermissionService,
    public readonly repairOrderHistoryService: RepairOrderHistoryService,
    public readonly repairUserRecordService: RepairUserRecordService,

  ) {
    super(userService, userPermissionService, repairOrderHistoryService, repairUserRecordService)
  }

}