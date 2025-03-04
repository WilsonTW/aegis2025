import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context, ArgsType, ObjectType, Field } from "@nestjs/graphql";

import { Domain } from './domain.entity';
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { Device } from "../device/device.entity";
import { DeviceService } from "../device/device.service";
import { RepairOrder } from "../repair_order/repair_order.entity";
import { RepairOrderService } from "../repair_order/repair_order.service";

import { DomainsResolverBase } from "./domain.resolver.base";
import { DomainService } from "./domain.service";
import { IsArray, IsNumber, IsObject, IsOptional } from "class-validator";
import { OmitType, PartialType } from "@nestjs/swagger";
import { GetDeviceArgs } from "../device/device.args";
import { GetDomainArgs } from "./domain.args";
import { GetUserArgs } from "../user/user.args";
import { GetRepairItemArgs } from "../repair_item/repair_item.args";
import { GetRepairOrderArgs } from "../repair_order/repair_order.args";
import { RoleService } from "../role/role.service";
import { DeviceConnectionService } from "../device_connection/device_connection.service";
import { SchedulerService } from "../scheduler/scheduler.service";
import { EventService } from "../event/event.service";
import { PowerSchedulerService } from "../power_scheduler/power_scheduler.service";
import { DomainGet } from "./domain.get.entity";
import { UserGet } from "../user/user.get.entity";
import { DeviceGet } from "../device/device.get.entity";
import { RepairOrderGet } from "../repair_order/repair_order.get.entity";

/*
@ObjectType()
export class DomainTree extends Domain {
  @IsArray()
  @IsOptional()
  @Field(type => [DomainTree], { nullable: true })
  child_domains?: DomainTree|undefined;
}
*/

@Resolver(of => DomainGet)
//export class DomainsResolver extends PartialType(OmitType(DomainsResolverBase, ['domain'])) {
export class DomainsResolver extends DomainsResolverBase {
  constructor(
    public readonly domainService: DomainService,
    public readonly domainServiceEx: DomainService,
    public readonly roleService: RoleService,
    public readonly userService: UserService,
    public readonly deviceConnectionService: DeviceConnectionService,
    public readonly deviceService: DeviceService,
    public readonly powerSchedulerService: PowerSchedulerService,
    public readonly schedulerService: SchedulerService,
    public readonly repairOrderService: RepairOrderService,
    public readonly eventService: EventService,

  ) {
    super(
      domainService,
      roleService,
      userService,
      deviceConnectionService,
      deviceService,
      powerSchedulerService,
      schedulerService,
      repairOrderService,
      eventService
    )
  }


  /*
  @Query(returns => DomainTree, { nullable: true })
  async domain (
      @Args('domain_id', {type:()=>Int, nullable:false}) domain_id:number,
      @Args('max_deepth', {type:()=>Int, nullable:true}) max_deepth:number|null
    ):Promise<DomainTree> {
    return this.domainService.getDomainTree(domain_id, max_deepth);
  }
  */

  @ResolveField('all_domains', returns => [DomainGet], {nullable: true})
  async all_domains(
      @Context() context,
      @Parent() domain: Domain,
      @Args() args: GetDomainArgs,
      @Args('max_deepth', {type:()=>Int, nullable:true, defaultValue:1000000}) max_deepth?:number
    ): Promise<Array<DomainGet>|null> {
    const { domain_id } = domain;
    delete args["max_deepth"];
    return this.domainService.getAllDomains(context.req?.user, this.domainService, domain_id, args, max_deepth);
  }
  
  @ResolveField('all_users', returns => [UserGet], {nullable: true})
  async all_users(
      @Context() context,
      @Parent() domain: Domain,
      @Args() args: GetUserArgs,
      @Args('max_deepth', {type:()=>Int, nullable:true, defaultValue:1000000}) max_deepth?:number
    ): Promise<Array<UserGet>|null> {
    const { domain_id } = domain;
    delete args["max_deepth"];
    return this.domainServiceEx.getAllUsers(context.req?.user, this.userService, domain_id, args, max_deepth);
  }
  
  @ResolveField('all_devices', returns => [DeviceGet], {nullable: true})
  async all_devices(
      @Context() context,
      @Parent() domain: Domain,
      @Args() args: GetDeviceArgs,
      @Args('max_deepth', {type:()=>Int, nullable:true, defaultValue:1000000}) max_deepth?:number,
    ): Promise<Array<DeviceGet>|null> {
    const { domain_id } = domain;
    delete args["max_deepth"];
    return this.domainServiceEx.getAllDevices(context.req?.user, this.deviceService, domain_id, args, max_deepth);
  }
  
  @ResolveField('all_repair_orders', returns => [RepairOrderGet], {nullable: true})
  async all_repair_orders(
      @Context() context,
      @Parent() domain: Domain,
      @Args() args: GetRepairOrderArgs,
      @Args('max_deepth', {type:()=>Int, nullable:true, defaultValue:1000000}) max_deepth?:number
    ): Promise<Array<RepairOrderGet>|null> {
    const { domain_id } = domain;
    delete args["max_deepth"];
    return this.domainServiceEx.getAllRepairOrders(context.req?.user, this.repairOrderService, domain_id, args, max_deepth);
  }
  

}