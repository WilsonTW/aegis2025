import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { RepairOrderHistory } from './repair_order_history.entity';
import { RepairOrder } from "../repair_order/repair_order.entity";
import { RepairOrderService } from "../repair_order/repair_order.service";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";

import { RepairOrderHistorysResolverBase } from "./repair_order_history.resolver.base";
import { RepairOrderHistoryService } from "./repair_order_history.service";
import { RepairOrderHistoryGet } from "./repair_order_history.get.entity";

@Resolver(of => RepairOrderHistoryGet)
export class RepairOrderHistorysResolver extends RepairOrderHistorysResolverBase {
  constructor(
    public readonly repairOrderHistoryService: RepairOrderHistoryService,
    public readonly repairOrderService: RepairOrderService,
    public readonly userService: UserService,

  ) {
    super(repairOrderHistoryService, repairOrderService, userService)
  }

}