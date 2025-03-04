import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { RepairType } from './repair_type.entity';
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { RepairItem } from "../repair_item/repair_item.entity";
import { RepairItemService } from "../repair_item/repair_item.service";

import { RepairTypesResolverBase } from "./repair_type.resolver.base";
import { RepairTypeService } from "./repair_type.service";
import { RepairTypeGet } from "./repair_type.get.entity";

@Resolver(of => RepairTypeGet)
export class RepairTypesResolver extends RepairTypesResolverBase {
  constructor(
    public readonly repairTypeService: RepairTypeService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly repairItemService: RepairItemService,

  ) {
    super(repairTypeService, deviceTypeService, repairItemService)
  }

}