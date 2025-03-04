import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { Scheduler } from './scheduler.entity';
import { Domain } from "../domain/domain.entity";
import { DomainService } from "../domain/domain.service";
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { Device } from "../device/device.entity";
import { DeviceService } from "../device/device.service";
import { DeviceInput } from "../device_input/device_input.entity";
import { DeviceInputService } from "../device_input/device_input.service";

import { SchedulersResolverBase } from "./scheduler.resolver.base";
import { SchedulerService } from "./scheduler.service";
import { SchedulerGet } from "./scheduler.get.entity";

@Resolver(of => SchedulerGet)
export class SchedulersResolver extends SchedulersResolverBase {
  constructor(
    public readonly schedulerService: SchedulerService,
    public readonly domainService: DomainService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceService: DeviceService,
    public readonly deviceInputService: DeviceInputService,

  ) {
    super(schedulerService, domainService, deviceTypeService, deviceService, deviceInputService)
  }

}