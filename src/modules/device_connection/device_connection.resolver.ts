import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { DeviceConnection } from './device_connection.entity';
import { Domain } from "../domain/domain.entity";
import { DomainService } from "../domain/domain.service";
import { DeviceOutput } from "../device_output/device_output.entity";
import { DeviceOutputService } from "../device_output/device_output.service";
import { DeviceInput } from "../device_input/device_input.entity";
import { DeviceInputService } from "../device_input/device_input.service";

import { DeviceConnectionsResolverBase } from "./device_connection.resolver.base";
import { DeviceConnectionService } from "./device_connection.service";
import { DeviceTypeService } from "../device_type/device_type.service";
import { DeviceService } from "../device/device.service";
import { DeviceConnectionGet } from "./device_connection.get.entity";

@Resolver(of => DeviceConnectionGet)
export class DeviceConnectionsResolver extends DeviceConnectionsResolverBase {
  constructor(
    public readonly deviceConnectionService: DeviceConnectionService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly domainService: DomainService,
    public readonly deviceService: DeviceService,
  ) {
    super(deviceConnectionService, deviceTypeService, domainService, deviceService)
  }

}