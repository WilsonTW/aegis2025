import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { RepairUserRecord } from './repair_user_record.entity';
import { RepairRecord } from "../repair_record/repair_record.entity";
import { RepairRecordService } from "../repair_record/repair_record.service";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";

import { RepairUserRecordsResolverBase } from "./repair_user_record.resolver.base";
import { RepairUserRecordService } from "./repair_user_record.service";
import { RepairUserRecordGet } from "./repair_user_record.get.entity";

@Resolver(of => RepairUserRecordGet)
export class RepairUserRecordsResolver extends RepairUserRecordsResolverBase {
  constructor(
    public readonly repairUserRecordService: RepairUserRecordService,
    public readonly repairRecordService: RepairRecordService,
    public readonly userService: UserService,

  ) {
    super(repairUserRecordService, repairRecordService, userService)
  }

}