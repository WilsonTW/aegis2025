import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { Device } from './device.entity';
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { Domain } from "../domain/domain.entity";
import { DomainService } from "../domain/domain.service";
import { Scheduler } from "../scheduler/scheduler.entity";
import { SchedulerService } from "../scheduler/scheduler.service";
import { RepairItem } from "../repair_item/repair_item.entity";
import { RepairItemService } from "../repair_item/repair_item.service";
import { Event } from "../event/event.entity";
import { EventService } from "../event/event.service";

import { DevicesResolverBase } from "./device.resolver.base";
import { DeviceService } from "./device.service";
import { MailService } from "../mail/mail.service";
import { DeviceTypeCategoryService } from "../device_type_category/device_type_category.service";
import { DeviceConnectionService } from "../device_connection/device_connection.service";
import { PowerSchedulerService } from "../power_scheduler/power_scheduler.service";
import { DeviceGet } from "./device.get.entity";

@Resolver(of => DeviceGet)
export class DevicesResolver extends DevicesResolverBase {
  constructor(
    public readonly deviceService: DeviceService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceTypeCategoryService: DeviceTypeCategoryService,
    public readonly deviceConnectionService: DeviceConnectionService,
    public readonly domainService: DomainService,
    public readonly powerSchedulerService: PowerSchedulerService,
    public readonly schedulerService: SchedulerService,
    public readonly repairItemService: RepairItemService,
    public readonly mailService: MailService,
  ) {
    super(deviceService, deviceTypeService, deviceTypeCategoryService, deviceConnectionService, domainService, powerSchedulerService, schedulerService, repairItemService, mailService)
  }

}