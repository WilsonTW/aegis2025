import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { DomainGet } from './domain.get.entity';
import { Role } from "../role/role.entity";
import { RoleGet } from "../role/role.get.entity";
import { RoleService } from "../role/role.service";
import { User } from "../user/user.entity";
import { UserGet } from "../user/user.get.entity";
import { UserService } from "../user/user.service";
import { DeviceConnection } from "../device_connection/device_connection.entity";
import { DeviceConnectionGet } from "../device_connection/device_connection.get.entity";
import { DeviceConnectionService } from "../device_connection/device_connection.service";
import { Device } from "../device/device.entity";
import { DeviceGet } from "../device/device.get.entity";
import { DeviceService } from "../device/device.service";
import { PowerScheduler } from "../power_scheduler/power_scheduler.entity";
import { PowerSchedulerGet } from "../power_scheduler/power_scheduler.get.entity";
import { PowerSchedulerService } from "../power_scheduler/power_scheduler.service";
import { Scheduler } from "../scheduler/scheduler.entity";
import { SchedulerGet } from "../scheduler/scheduler.get.entity";
import { SchedulerService } from "../scheduler/scheduler.service";
import { RepairOrder } from "../repair_order/repair_order.entity";
import { RepairOrderGet } from "../repair_order/repair_order.get.entity";
import { RepairOrderService } from "../repair_order/repair_order.service";
import { Event } from "../event/event.entity";
import { EventGet } from "../event/event.get.entity";
import { EventService } from "../event/event.service";

import { DomainService } from "./domain.service";
import { GetDomainArgs } from "./domain.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetRoleArgs } from "../role/role.args";
import { GetUserArgs } from "../user/user.args";
import { GetDeviceConnectionArgs } from "../device_connection/device_connection.args";
import { GetDeviceArgs } from "../device/device.args";
import { GetPowerSchedulerArgs } from "../power_scheduler/power_scheduler.args";
import { GetSchedulerArgs } from "../scheduler/scheduler.args";
import { GetRepairOrderArgs } from "../repair_order/repair_order.args";
import { GetEventArgs } from "../event/event.args";


@Resolver(of => DomainGet)
export class DomainsResolverBase {
  constructor(
    public readonly domainService: DomainService,
    public readonly roleService: RoleService,
    public readonly userService: UserService,
    public readonly deviceConnectionService: DeviceConnectionService,
    public readonly deviceService: DeviceService,
    public readonly powerSchedulerService: PowerSchedulerService,
    public readonly schedulerService: SchedulerService,
    public readonly repairOrderService: RepairOrderService,
    public readonly eventService: EventService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [DomainGet])
  domains(
    @Context() context,
    @Args() args: GetDomainArgs
    //parent, args, contextValue, info
  ): Promise<DomainGet[]> {
    var service:any = this.domainService
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
  @Query(returns => DomainGet, { nullable: true })
  async domain(@Context() context, @Args('domain_id', {type:()=>Int}) domain_id:number):Promise<DomainGet|null> {
    var service:any = this.domainService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, domain_id);
  }


  @ResolveField('parent_domain', returns => DomainGet, {nullable: true})
  async parent_domain(@Context() context, @Parent() domain: DomainGet): Promise<DomainGet|null> {
    const { parent_domain_id } = domain;
    var service:any = this.domainService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (parent_domain_id==null)?null:findOne(context.req?.user, parent_domain_id);
  }

  @ResolveField('child_domains', returns => [DomainGet], {nullable:true})
  async child_domains(
      @Context() context,
      @Parent() domain: DomainGet,
      @Args() args: GetDomainArgs
    ): Promise<Array<DomainGet|null>> {
    const {domain_id} = domain;
    if (domain_id==null) return null;
    if (args==null) args = {}
    args.parent_domain_id = domain_id;
    var service:any = this.domainService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('roles', returns => [RoleGet], {nullable:true})
  async roles(
      @Context() context,
      @Parent() domain: DomainGet,
      @Args() args: GetRoleArgs
    ): Promise<Array<RoleGet|null>> {
    const {domain_id} = domain;
    if (domain_id==null) return null;
    if (args==null) args = {}
    args.domain_id = domain_id;
    var service:any = this.roleService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('users', returns => [UserGet], {nullable:true})
  async users(
      @Context() context,
      @Parent() domain: DomainGet,
      @Args() args: GetUserArgs
    ): Promise<Array<UserGet|null>> {
    const {domain_id} = domain;
    if (domain_id==null) return null;
    if (args==null) args = {}
    args.domain_id = domain_id;
    var service:any = this.userService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('device_connections', returns => [DeviceConnectionGet], {nullable:true})
  async device_connections(
      @Context() context,
      @Parent() domain: DomainGet,
      @Args() args: GetDeviceConnectionArgs
    ): Promise<Array<DeviceConnectionGet|null>> {
    const {domain_id} = domain;
    if (domain_id==null) return null;
    if (args==null) args = {}
    args.organization_id = domain_id;
    var service:any = this.deviceConnectionService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('devices', returns => [DeviceGet], {nullable:true})
  async devices(
      @Context() context,
      @Parent() domain: DomainGet,
      @Args() args: GetDeviceArgs
    ): Promise<Array<DeviceGet|null>> {
    const {domain_id} = domain;
    if (domain_id==null) return null;
    if (args==null) args = {}
    args.domain_id = domain_id;
    var service:any = this.deviceService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('power_schedulers', returns => [PowerSchedulerGet], {nullable:true})
  async power_schedulers(
      @Context() context,
      @Parent() domain: DomainGet,
      @Args() args: GetPowerSchedulerArgs
    ): Promise<Array<PowerSchedulerGet|null>> {
    const {domain_id} = domain;
    if (domain_id==null) return null;
    if (args==null) args = {}
    args.domain_id = domain_id;
    var service:any = this.powerSchedulerService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('schedulers', returns => [SchedulerGet], {nullable:true})
  async schedulers(
      @Context() context,
      @Parent() domain: DomainGet,
      @Args() args: GetSchedulerArgs
    ): Promise<Array<SchedulerGet|null>> {
    const {domain_id} = domain;
    if (domain_id==null) return null;
    if (args==null) args = {}
    args.organization_id = domain_id;
    var service:any = this.schedulerService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('repair_orders', returns => [RepairOrderGet], {nullable:true})
  async repair_orders(
      @Context() context,
      @Parent() domain: DomainGet,
      @Args() args: GetRepairOrderArgs
    ): Promise<Array<RepairOrderGet|null>> {
    const {domain_id} = domain;
    if (domain_id==null) return null;
    if (args==null) args = {}
    args.domain_id = domain_id;
    var service:any = this.repairOrderService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('events', returns => [EventGet], {nullable:true})
  async events(
      @Context() context,
      @Parent() domain: DomainGet,
      @Args() args: GetEventArgs
    ): Promise<Array<EventGet|null>> {
    const {domain_id} = domain;
    if (domain_id==null) return null;
    if (args==null) args = {}
    args.domain_id = domain_id;
    var service:any = this.eventService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                

}