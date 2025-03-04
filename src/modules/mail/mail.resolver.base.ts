import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { MailGet } from './mail.get.entity';
import { User } from "../user/user.entity";
import { UserGet } from "../user/user.get.entity";
import { UserService } from "../user/user.service";
import { RepairOrder } from "../repair_order/repair_order.entity";
import { RepairOrderGet } from "../repair_order/repair_order.get.entity";
import { RepairOrderService } from "../repair_order/repair_order.service";
import { Device } from "../device/device.entity";
import { DeviceGet } from "../device/device.get.entity";
import { DeviceService } from "../device/device.service";

import { MailService } from "./mail.service";
import { GetMailArgs } from "./mail.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetUserArgs } from "../user/user.args";
import { GetRepairOrderArgs } from "../repair_order/repair_order.args";
import { GetDeviceArgs } from "../device/device.args";


@Resolver(of => MailGet)
export class MailsResolverBase {
  constructor(
    public readonly mailService: MailService,
    public readonly userService: UserService,
    public readonly repairOrderService: RepairOrderService,
    public readonly deviceService: DeviceService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [MailGet])
  mails(
    @Context() context,
    @Args() args: GetMailArgs
    //parent, args, contextValue, info
  ): Promise<MailGet[]> {
    var service:any = this.mailService
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
  @Query(returns => MailGet, { nullable: true })
  async mail(@Context() context, @Args('mail_id', {type:()=>Int}) mail_id:number):Promise<MailGet|null> {
    var service:any = this.mailService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, mail_id);
  }


  @ResolveField('user', returns => UserGet, {nullable: true})
  async user(@Context() context, @Parent() mail: MailGet): Promise<UserGet|null> {
    const { user_id } = mail;
    var service:any = this.userService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (user_id==null)?null:findOne(context.req?.user, user_id);
  }

  @ResolveField('repair_order', returns => RepairOrderGet, {nullable: true})
  async repair_order(@Context() context, @Parent() mail: MailGet): Promise<RepairOrderGet|null> {
    const { repair_order_id } = mail;
    var service:any = this.repairOrderService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (repair_order_id==null)?null:findOne(context.req?.user, repair_order_id);
  }

  @ResolveField('device', returns => DeviceGet, {nullable: true})
  async device(@Context() context, @Parent() mail: MailGet): Promise<DeviceGet|null> {
    const { device_id } = mail;
    var service:any = this.deviceService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (device_id==null)?null:findOne(context.req?.user, device_id);
  }


}