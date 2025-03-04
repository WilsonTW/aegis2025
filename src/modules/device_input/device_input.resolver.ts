import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { DeviceInput } from './device_input.entity';
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { DeviceOutput } from "../device_output/device_output.entity";
import { DeviceOutputService } from "../device_output/device_output.service";
import { Scheduler } from "../scheduler/scheduler.entity";
import { SchedulerService } from "../scheduler/scheduler.service";

import { DeviceInputsResolverBase } from "./device_input.resolver.base";
import { DeviceInputService } from "./device_input.service";
import { DeviceInputGet } from "./device_input.get.entity";

@Resolver(of => DeviceInputGet)
export class DeviceInputsResolver extends DeviceInputsResolverBase {
  constructor(
    public readonly deviceInputService: DeviceInputService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceOutputService: DeviceOutputService,
    public readonly schedulerService: SchedulerService,

  ) {
    super(deviceInputService, deviceTypeService, deviceOutputService, schedulerService)
  }

}