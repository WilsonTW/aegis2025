import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { UserGet } from './user.get.entity';
import { Domain } from "../domain/domain.entity";
import { DomainGet } from "../domain/domain.get.entity";
import { DomainService } from "../domain/domain.service";
import { Role } from "../role/role.entity";
import { RoleGet } from "../role/role.get.entity";
import { RoleService } from "../role/role.service";
import { PowerScheduler } from "../power_scheduler/power_scheduler.entity";
import { PowerSchedulerGet } from "../power_scheduler/power_scheduler.get.entity";
import { PowerSchedulerService } from "../power_scheduler/power_scheduler.service";
import { RepairOrder } from "../repair_order/repair_order.entity";
import { RepairOrderGet } from "../repair_order/repair_order.get.entity";
import { RepairOrderService } from "../repair_order/repair_order.service";
import { RepairOrderHistory } from "../repair_order_history/repair_order_history.entity";
import { RepairOrderHistoryGet } from "../repair_order_history/repair_order_history.get.entity";
import { RepairOrderHistoryService } from "../repair_order_history/repair_order_history.service";
import { RepairUserRecord } from "../repair_user_record/repair_user_record.entity";
import { RepairUserRecordGet } from "../repair_user_record/repair_user_record.get.entity";
import { RepairUserRecordService } from "../repair_user_record/repair_user_record.service";
import { Mail } from "../mail/mail.entity";
import { MailGet } from "../mail/mail.get.entity";
import { MailService } from "../mail/mail.service";

import { UserService } from "./user.service";
import { GetUserArgs } from "./user.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetDomainArgs } from "../domain/domain.args";
import { GetRoleArgs } from "../role/role.args";
import { GetPowerSchedulerArgs } from "../power_scheduler/power_scheduler.args";
import { GetRepairOrderArgs } from "../repair_order/repair_order.args";
import { GetRepairOrderHistoryArgs } from "../repair_order_history/repair_order_history.args";
import { GetRepairUserRecordArgs } from "../repair_user_record/repair_user_record.args";
import { GetMailArgs } from "../mail/mail.args";


@Resolver(of => UserGet)
export class UsersResolverBase {
  constructor(
    public readonly userService: UserService,
    public readonly domainService: DomainService,
    public readonly roleService: RoleService,
    public readonly powerSchedulerService: PowerSchedulerService,
    public readonly repairOrderService: RepairOrderService,
    public readonly repairOrderHistoryService: RepairOrderHistoryService,
    public readonly repairUserRecordService: RepairUserRecordService,
    public readonly mailService: MailService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [UserGet])
  users(
    @Context() context,
    @Args() args: GetUserArgs
    //parent, args, contextValue, info
  ): Promise<UserGet[]> {
    var service:any = this.userService
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
  @Query(returns => UserGet, { nullable: true })
  async user(@Context() context, @Args('user_id', {type:()=>Int}) user_id:number):Promise<UserGet|null> {
    var service:any = this.userService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, user_id);
  }


  @ResolveField('domain', returns => DomainGet, {nullable: true})
  async domain(@Context() context, @Parent() user: UserGet): Promise<DomainGet|null> {
    const { domain_id } = user;
    var service:any = this.domainService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (domain_id==null)?null:findOne(context.req?.user, domain_id);
  }

  @ResolveField('role', returns => RoleGet, {nullable: true})
  async role(@Context() context, @Parent() user: UserGet): Promise<RoleGet|null> {
    const { role_id } = user;
    var service:any = this.roleService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (role_id==null)?null:findOne(context.req?.user, role_id);
  }

  @ResolveField('power_schedulers', returns => [PowerSchedulerGet], {nullable:true})
  async power_schedulers(
      @Context() context,
      @Parent() user: UserGet,
      @Args() args: GetPowerSchedulerArgs
    ): Promise<Array<PowerSchedulerGet|null>> {
    const {user_id} = user;
    if (user_id==null) return null;
    if (args==null) args = {}
    args.notify_user_id = user_id;
    var service:any = this.powerSchedulerService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('repair_order_creator', returns => [RepairOrderGet], {nullable:true})
  async repair_order_creator(
      @Context() context,
      @Parent() user: UserGet,
      @Args() args: GetRepairOrderArgs
    ): Promise<Array<RepairOrderGet|null>> {
    const {user_id} = user;
    if (user_id==null) return null;
    if (args==null) args = {}
    args.creator_id = user_id;
    var service:any = this.repairOrderService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('repair_order_supplier', returns => [RepairOrderGet], {nullable:true})
  async repair_order_supplier(
      @Context() context,
      @Parent() user: UserGet,
      @Args() args: GetRepairOrderArgs
    ): Promise<Array<RepairOrderGet|null>> {
    const {user_id} = user;
    if (user_id==null) return null;
    if (args==null) args = {}
    args.supplier_id = user_id;
    var service:any = this.repairOrderService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('repair_order_assign_user', returns => [RepairOrderGet], {nullable:true})
  async repair_order_assign_user(
      @Context() context,
      @Parent() user: UserGet,
      @Args() args: GetRepairOrderArgs
    ): Promise<Array<RepairOrderGet|null>> {
    const {user_id} = user;
    if (user_id==null) return null;
    if (args==null) args = {}
    args.assign_user_id = user_id;
    var service:any = this.repairOrderService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('repair_order_historys', returns => [RepairOrderHistoryGet], {nullable:true})
  async repair_order_historys(
      @Context() context,
      @Parent() user: UserGet,
      @Args() args: GetRepairOrderHistoryArgs
    ): Promise<Array<RepairOrderHistoryGet|null>> {
    const {user_id} = user;
    if (user_id==null) return null;
    if (args==null) args = {}
    args.user_id = user_id;
    var service:any = this.repairOrderHistoryService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('repair_user_records', returns => [RepairUserRecordGet], {nullable:true})
  async repair_user_records(
      @Context() context,
      @Parent() user: UserGet,
      @Args() args: GetRepairUserRecordArgs
    ): Promise<Array<RepairUserRecordGet|null>> {
    const {user_id} = user;
    if (user_id==null) return null;
    if (args==null) args = {}
    args.user_id = user_id;
    var service:any = this.repairUserRecordService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('mails', returns => [MailGet], {nullable:true})
  async mails(
      @Context() context,
      @Parent() user: UserGet,
      @Args() args: GetMailArgs
    ): Promise<Array<MailGet|null>> {
    const {user_id} = user;
    if (user_id==null) return null;
    if (args==null) args = {}
    args.user_id = user_id;
    var service:any = this.mailService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                

}