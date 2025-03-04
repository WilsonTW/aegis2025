import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { RepairItem } from './repair_item.entity';
import { RepairType } from "../repair_type/repair_type.entity";
import { RepairTypeService } from "../repair_type/repair_type.service";
import { RepairOrder } from "../repair_order/repair_order.entity";
import { RepairOrderService } from "../repair_order/repair_order.service";
import { Device } from "../device/device.entity";
import { DeviceService } from "../device/device.service";
import { RepairRecord } from "../repair_record/repair_record.entity";
import { RepairRecordService } from "../repair_record/repair_record.service";

import { RepairItemsResolverBase } from "./repair_item.resolver.base";
import { RepairItemService } from "./repair_item.service";
import { RepairItemGet } from "./repair_item.get.entity";

@Resolver(of => RepairItemGet)
export class RepairItemsResolver extends RepairItemsResolverBase {
  constructor(
    public readonly repairItemService: RepairItemService,
    public readonly repairTypeService: RepairTypeService,
    public readonly repairOrderService: RepairOrderService,
    public readonly deviceService: DeviceService,
    public readonly repairRecordService: RepairRecordService,

  ) {
    super(repairItemService, repairTypeService, repairOrderService, deviceService, repairRecordService)
  }

}