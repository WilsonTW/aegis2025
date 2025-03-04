import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { Event } from './event.entity';
import { Domain } from "../domain/domain.entity";
import { DomainService } from "../domain/domain.service";
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { DeviceOutput } from "../device_output/device_output.entity";
import { DeviceOutputService } from "../device_output/device_output.service";

import { EventsResolverBase } from "./event.resolver.base";
import { EventService } from "./event.service";
import { EventGet } from "./event.get.entity";

@Resolver(of => EventGet)
export class EventsResolver extends EventsResolverBase {
  constructor(
    public readonly eventService: EventService,
    public readonly domainService: DomainService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceOutputService: DeviceOutputService,

  ) {
    super(eventService, domainService, deviceTypeService, deviceOutputService)
  }

}