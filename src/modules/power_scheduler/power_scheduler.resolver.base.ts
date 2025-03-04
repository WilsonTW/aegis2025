import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { PowerSchedulerGet } from './power_scheduler.get.entity';
import { Domain } from "../domain/domain.entity";
import { DomainGet } from "../domain/domain.get.entity";
import { DomainService } from "../domain/domain.service";
import { Device } from "../device/device.entity";
import { DeviceGet } from "../device/device.get.entity";
import { DeviceService } from "../device/device.service";
import { User } from "../user/user.entity";
import { UserGet } from "../user/user.get.entity";
import { UserService } from "../user/user.service";

import { PowerSchedulerService } from "./power_scheduler.service";
import { GetPowerSchedulerArgs } from "./power_scheduler.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetDomainArgs } from "../domain/domain.args";
import { GetDeviceArgs } from "../device/device.args";
import { GetUserArgs } from "../user/user.args";


@Resolver(of => PowerSchedulerGet)
export class PowerSchedulersResolverBase {
  constructor(
    public readonly powerSchedulerService: PowerSchedulerService,
    public readonly domainService: DomainService,
    public readonly deviceService: DeviceService,
    public readonly userService: UserService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [PowerSchedulerGet])
  power_schedulers(
    @Context() context,
    @Args() args: GetPowerSchedulerArgs
    //parent, args, contextValue, info
  ): Promise<PowerSchedulerGet[]> {
    var service:any = this.powerSchedulerService
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
  @Query(returns => PowerSchedulerGet, { nullable: true })
  async power_scheduler(@Context() context, @Args('power_scheduler_id', {type:()=>Int}) power_scheduler_id:number):Promise<PowerSchedulerGet|null> {
    var service:any = this.powerSchedulerService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, power_scheduler_id);
  }


  @ResolveField('domain', returns => DomainGet, {nullable: true})
  async domain(@Context() context, @Parent() power_scheduler: PowerSchedulerGet): Promise<DomainGet|null> {
    const { domain_id } = power_scheduler;
    var service:any = this.domainService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (domain_id==null)?null:findOne(context.req?.user, domain_id);
  }

  @ResolveField('device', returns => DeviceGet, {nullable: true})
  async device(@Context() context, @Parent() power_scheduler: PowerSchedulerGet): Promise<DeviceGet|null> {
    const { device_id } = power_scheduler;
    var service:any = this.deviceService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (device_id==null)?null:findOne(context.req?.user, device_id);
  }

  @ResolveField('notify_user', returns => UserGet, {nullable: true})
  async notify_user(@Context() context, @Parent() power_scheduler: PowerSchedulerGet): Promise<UserGet|null> {
    const { notify_user_id } = power_scheduler;
    var service:any = this.userService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (notify_user_id==null)?null:findOne(context.req?.user, notify_user_id);
  }


}