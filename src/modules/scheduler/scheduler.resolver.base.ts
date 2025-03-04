import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { SchedulerGet } from './scheduler.get.entity';
import { Domain } from "../domain/domain.entity";
import { DomainGet } from "../domain/domain.get.entity";
import { DomainService } from "../domain/domain.service";
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeGet } from "../device_type/device_type.get.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { Device } from "../device/device.entity";
import { DeviceGet } from "../device/device.get.entity";
import { DeviceService } from "../device/device.service";
import { DeviceInput } from "../device_input/device_input.entity";
import { DeviceInputGet } from "../device_input/device_input.get.entity";
import { DeviceInputService } from "../device_input/device_input.service";

import { SchedulerService } from "./scheduler.service";
import { GetSchedulerArgs } from "./scheduler.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetDomainArgs } from "../domain/domain.args";
import { GetDeviceTypeArgs } from "../device_type/device_type.args";
import { GetDeviceArgs } from "../device/device.args";
import { GetDeviceInputArgs } from "../device_input/device_input.args";


@Resolver(of => SchedulerGet)
export class SchedulersResolverBase {
  constructor(
    public readonly schedulerService: SchedulerService,
    public readonly domainService: DomainService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceService: DeviceService,
    public readonly deviceInputService: DeviceInputService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [SchedulerGet])
  schedulers(
    @Context() context,
    @Args() args: GetSchedulerArgs
    //parent, args, contextValue, info
  ): Promise<SchedulerGet[]> {
    var service:any = this.schedulerService
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
  @Query(returns => SchedulerGet, { nullable: true })
  async scheduler(@Context() context, @Args('scheduler_id', {type:()=>Int}) scheduler_id:number):Promise<SchedulerGet|null> {
    var service:any = this.schedulerService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, scheduler_id);
  }


  @ResolveField('organization', returns => DomainGet, {nullable: true})
  async organization(@Context() context, @Parent() scheduler: SchedulerGet): Promise<DomainGet|null> {
    const { organization_id } = scheduler;
    var service:any = this.domainService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (organization_id==null)?null:findOne(context.req?.user, organization_id);
  }

  @ResolveField('device_type', returns => DeviceTypeGet, {nullable: true})
  async device_type(@Context() context, @Parent() scheduler: SchedulerGet): Promise<DeviceTypeGet|null> {
    const { device_type_id } = scheduler;
    var service:any = this.deviceTypeService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (device_type_id==null)?null:findOne(context.req?.user, device_type_id);
  }

  @ResolveField('device', returns => DeviceGet, {nullable: true})
  async device(@Context() context, @Parent() scheduler: SchedulerGet): Promise<DeviceGet|null> {
    const { device_id } = scheduler;
    var service:any = this.deviceService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (device_id==null)?null:findOne(context.req?.user, device_id);
  }

  @ResolveField('device_input', returns => DeviceInputGet, {nullable: true})
  async device_input(@Context() context, @Parent() scheduler: SchedulerGet): Promise<DeviceInputGet|null> {
    const { device_input_id } = scheduler;
    var service:any = this.deviceInputService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (device_input_id==null)?null:findOne(context.req?.user, device_input_id);
  }


}