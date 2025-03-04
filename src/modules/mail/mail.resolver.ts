import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { Mail } from './mail.entity';
import { Setting } from "../setting/setting.entity";
import { SettingService } from "../setting/setting.service";
import { Domain } from "../domain/domain.entity";
import { DomainService } from "../domain/domain.service";
import { Role } from "../role/role.entity";
import { RoleService } from "../role/role.service";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { DeviceConnection } from "../device_connection/device_connection.entity";
import { DeviceConnectionService } from "../device_connection/device_connection.service";
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
import { RepairOrder } from "../repair_order/repair_order.entity";
import { RepairOrderService } from "../repair_order/repair_order.service";
import { RepairItem } from "../repair_item/repair_item.entity";
import { RepairItemService } from "../repair_item/repair_item.service";
import { RepairOrderHistory } from "../repair_order_history/repair_order_history.entity";
import { RepairOrderHistoryService } from "../repair_order_history/repair_order_history.service";
import { RepairRecord } from "../repair_record/repair_record.entity";
import { RepairRecordService } from "../repair_record/repair_record.service";
import { RepairUserRecord } from "../repair_user_record/repair_user_record.entity";
import { RepairUserRecordService } from "../repair_user_record/repair_user_record.service";
import { Event } from "../event/event.entity";
import { EventService } from "../event/event.service";

import { MailsResolverBase } from "./mail.resolver.base";
import { MailService } from "./mail.service";
import { MailGet } from "./mail.get.entity";

@Resolver(of => MailGet)
export class MailsResolver extends MailsResolverBase {
  constructor(
    public readonly mailService: MailService,
    public readonly userService: UserService,
    public readonly repairOrderService: RepairOrderService,
    public readonly deviceService: DeviceService,

  ) {
    super(mailService, userService, repairOrderService, deviceService)
  }

}