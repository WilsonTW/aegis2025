import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { DeviceMeterGet } from './device_meter.get.entity';
//--- @(reference_import) ---
import { DeviceMetersResolverBase } from "./device_meter.resolver.base";
import { DeviceMeterService } from "./device_meter.service";

@Resolver(of => DeviceMeterGet)
export class DeviceMetersResolver extends DeviceMetersResolverBase {
  constructor(
    public readonly deviceMeterService: DeviceMeterService,
//--- @(reference_service) ---
  ) {
    super(deviceMeterService/* @(super_services) */)
  }

}