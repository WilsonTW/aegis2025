import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { DeviceTypeCategory } from './device_type_category.entity';
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { Device } from "../device/device.entity";
import { DeviceService } from "../device/device.service";

import { DeviceTypeCategorysResolverBase } from "./device_type_category.resolver.base";
import { DeviceTypeCategoryService } from "./device_type_category.service";
import { DeviceTypeCategoryGet } from "./device_type_category.get.entity";

@Resolver(of => DeviceTypeCategoryGet)
export class DeviceTypeCategorysResolver extends DeviceTypeCategorysResolverBase {
  constructor(
    public readonly deviceTypeCategoryService: DeviceTypeCategoryService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceService: DeviceService,

  ) {
    super(deviceTypeCategoryService, deviceTypeService, deviceService)
  }

}