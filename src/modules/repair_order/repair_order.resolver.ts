import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { RepairOrder } from './repair_order.entity';
import { Domain } from "../domain/domain.entity";
import { DomainService } from "../domain/domain.service";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { RepairItem } from "../repair_item/repair_item.entity";
import { RepairItemService } from "../repair_item/repair_item.service";
import { RepairOrderHistory } from "../repair_order_history/repair_order_history.entity";
import { RepairOrderHistoryService } from "../repair_order_history/repair_order_history.service";
import { RepairRecord } from "../repair_record/repair_record.entity";
import { RepairRecordService } from "../repair_record/repair_record.service";

import { RepairOrdersResolverBase } from "./repair_order.resolver.base";
import { RepairOrderService } from "./repair_order.service";
import { MailService } from "../mail/mail.service";
import { RepairOrderGet } from "./repair_order.get.entity";

@Resolver(of => RepairOrderGet)
export class RepairOrdersResolver extends RepairOrdersResolverBase {
  constructor(
    public readonly repairOrderService: RepairOrderService,
    public readonly domainService: DomainService,
    public readonly userService: UserService,
    public readonly repairOrderHistoryService: RepairOrderHistoryService,
    public readonly repairItemService: RepairItemService,
    public readonly repairRecordService: RepairRecordService,
    public readonly mailService: MailService,

  ) {
    super(repairOrderService, domainService, userService, repairOrderHistoryService, repairItemService, repairRecordService, mailService)
  }

}