import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { DeviceGet } from './device.get.entity';
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeGet } from "../device_type/device_type.get.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { DeviceTypeCategory } from "../device_type_category/device_type_category.entity";
import { DeviceTypeCategoryGet } from "../device_type_category/device_type_category.get.entity";
import { DeviceTypeCategoryService } from "../device_type_category/device_type_category.service";
import { DeviceConnection } from "../device_connection/device_connection.entity";
import { DeviceConnectionGet } from "../device_connection/device_connection.get.entity";
import { DeviceConnectionService } from "../device_connection/device_connection.service";
import { Domain } from "../domain/domain.entity";
import { DomainGet } from "../domain/domain.get.entity";
import { DomainService } from "../domain/domain.service";
import { PowerScheduler } from "../power_scheduler/power_scheduler.entity";
import { PowerSchedulerGet } from "../power_scheduler/power_scheduler.get.entity";
import { PowerSchedulerService } from "../power_scheduler/power_scheduler.service";
import { Scheduler } from "../scheduler/scheduler.entity";
import { SchedulerGet } from "../scheduler/scheduler.get.entity";
import { SchedulerService } from "../scheduler/scheduler.service";
import { RepairItem } from "../repair_item/repair_item.entity";
import { RepairItemGet } from "../repair_item/repair_item.get.entity";
import { RepairItemService } from "../repair_item/repair_item.service";
import { Mail } from "../mail/mail.entity";
import { MailGet } from "../mail/mail.get.entity";
import { MailService } from "../mail/mail.service";

import { DeviceService } from "./device.service";
import { GetDeviceArgs } from "./device.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetDeviceTypeArgs } from "../device_type/device_type.args";
import { GetDeviceTypeCategoryArgs } from "../device_type_category/device_type_category.args";
import { GetDeviceConnectionArgs } from "../device_connection/device_connection.args";
import { GetDomainArgs } from "../domain/domain.args";
import { GetPowerSchedulerArgs } from "../power_scheduler/power_scheduler.args";
import { GetSchedulerArgs } from "../scheduler/scheduler.args";
import { GetRepairItemArgs } from "../repair_item/repair_item.args";
import { GetMailArgs } from "../mail/mail.args";


@Resolver(of => DeviceGet)
export class DevicesResolverBase {
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

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [DeviceGet])
  devices(
    @Context() context,
    @Args() args: GetDeviceArgs
    //parent, args, contextValue, info
  ): Promise<DeviceGet[]> {
    var service:any = this.deviceService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    if (args==null || Object.keys(args).length==0) {
      return findAll(context.req?.user);
    } else {
      return findAll(context.req?.user, {
        where: args,
      });
    }
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns => DeviceGet, { nullable: true })
  async device(@Context() context, @Args('device_id', {type:()=>Int}) device_id:number):Promise<DeviceGet|null> {
    var service:any = this.deviceService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, device_id);
  }


  @ResolveField('device_type', returns => DeviceTypeGet, {nullable: true})
  async device_type(@Context() context, @Parent() device: DeviceGet): Promise<DeviceTypeGet|null> {
    const { device_type_id } = device;
    var service:any = this.deviceTypeService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (device_type_id==null)?null:findOne(context.req?.user, device_type_id);
  }

  @ResolveField('device_type_category', returns => DeviceTypeCategoryGet, {nullable: true})
  async device_type_category(@Context() context, @Parent() device: DeviceGet): Promise<DeviceTypeCategoryGet|null> {
    const { device_type_category_id } = device;
    var service:any = this.deviceTypeCategoryService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (device_type_category_id==null)?null:findOne(context.req?.user, device_type_category_id);
  }

  @ResolveField('device_connection', returns => DeviceConnectionGet, {nullable: true})
  async device_connection(@Context() context, @Parent() device: DeviceGet): Promise<DeviceConnectionGet|null> {
    const { device_connection_id } = device;
    var service:any = this.deviceConnectionService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (device_connection_id==null)?null:findOne(context.req?.user, device_connection_id);
  }

  @ResolveField('domain', returns => DomainGet, {nullable: true})
  async domain(@Context() context, @Parent() device: DeviceGet): Promise<DomainGet|null> {
    const { domain_id } = device;
    var service:any = this.domainService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (domain_id==null)?null:findOne(context.req?.user, domain_id);
  }

  @ResolveField('power_schedulers', returns => [PowerSchedulerGet], {nullable:true})
  async power_schedulers(
      @Context() context,
      @Parent() device: DeviceGet,
      @Args() args: GetPowerSchedulerArgs
    ): Promise<Array<PowerSchedulerGet|null>> {
    const {device_id} = device;
    if (device_id==null) return null;
    if (args==null) args = {}
    args.device_id = device_id;
    var service:any = this.powerSchedulerService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('schedulers', returns => [SchedulerGet], {nullable:true})
  async schedulers(
      @Context() context,
      @Parent() device: DeviceGet,
      @Args() args: GetSchedulerArgs
    ): Promise<Array<SchedulerGet|null>> {
    const {device_id} = device;
    if (device_id==null) return null;
    if (args==null) args = {}
    args.device_id = device_id;
    var service:any = this.schedulerService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('repair_items', returns => [RepairItemGet], {nullable:true})
  async repair_items(
      @Context() context,
      @Parent() device: DeviceGet,
      @Args() args: GetRepairItemArgs
    ): Promise<Array<RepairItemGet|null>> {
    const {device_id} = device;
    if (device_id==null) return null;
    if (args==null) args = {}
    args.device_id = device_id;
    var service:any = this.repairItemService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('mails', returns => [MailGet], {nullable:true})
  async mails(
      @Context() context,
      @Parent() device: DeviceGet,
      @Args() args: GetMailArgs
    ): Promise<Array<MailGet|null>> {
    const {device_id} = device;
    if (device_id==null) return null;
    if (args==null) args = {}
    args.device_id = device_id;
    var service:any = this.mailService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                

}