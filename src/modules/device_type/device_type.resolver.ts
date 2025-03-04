import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { DeviceType } from './device_type.entity';
import { Domain } from "../domain/domain.entity";
import { DomainService } from "../domain/domain.service";
import { DeviceOutput } from "../device_output/device_output.entity";
import { DeviceOutputService } from "../device_output/device_output.service";
import { DeviceInput } from "../device_input/device_input.entity";
import { DeviceInputService } from "../device_input/device_input.service";
import { Device } from "../device/device.entity";
import { DeviceService } from "../device/device.service";
import { Scheduler } from "../scheduler/scheduler.entity";
import { SchedulerService } from "../scheduler/scheduler.service";
import { RepairType } from "../repair_type/repair_type.entity";
import { RepairTypeService } from "../repair_type/repair_type.service";

import { DeviceTypesResolverBase } from "./device_type.resolver.base";
import { DeviceTypeService } from "./device_type.service";
import { EventService } from "../event/event.service";
import { DeviceConnectionService } from "../device_connection/device_connection.service";
import { DeviceTypeCategoryService } from "../device_type_category/device_type_category.service";
import { DeviceTypeGet } from "./device_type.get.entity";

@Resolver(of => DeviceTypeGet)
export class DeviceTypesResolver extends DeviceTypesResolverBase {
  constructor(
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceTypeCategoryService: DeviceTypeCategoryService,
    public readonly deviceConnectionService: DeviceConnectionService,
    public readonly deviceOutputService: DeviceOutputService,
    public readonly deviceInputService: DeviceInputService,
    public readonly deviceService: DeviceService,
    public readonly schedulerService: SchedulerService,
    public readonly repairTypeService: RepairTypeService,
    public readonly eventService: EventService,

  ) {
    super(deviceTypeService, deviceTypeCategoryService, deviceConnectionService, deviceOutputService, deviceInputService, deviceService, schedulerService, repairTypeService, eventService)
  }

}