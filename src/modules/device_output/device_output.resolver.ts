import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { DeviceOutput } from './device_output.entity';
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { DeviceInput } from "../device_input/device_input.entity";
import { DeviceInputService } from "../device_input/device_input.service";
import { Event } from "../event/event.entity";
import { EventService } from "../event/event.service";

import { DeviceOutputsResolverBase } from "./device_output.resolver.base";
import { DeviceOutputService } from "./device_output.service";
import { DeviceOutputGet } from "./device_output.get.entity";

@Resolver(of => DeviceOutputGet)
export class DeviceOutputsResolver extends DeviceOutputsResolverBase {
  constructor(
    public readonly deviceOutputService: DeviceOutputService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceInputService: DeviceInputService,
    public readonly eventService: EventService,

  ) {
    super(deviceOutputService, deviceTypeService, deviceInputService, eventService)
  }

}