import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { RepairOrderGet } from './repair_order.get.entity';
import { Domain } from "../domain/domain.entity";
import { DomainGet } from "../domain/domain.get.entity";
import { DomainService } from "../domain/domain.service";
import { User } from "../user/user.entity";
import { UserGet } from "../user/user.get.entity";
import { UserService } from "../user/user.service";
import { RepairOrderHistory } from "../repair_order_history/repair_order_history.entity";
import { RepairOrderHistoryGet } from "../repair_order_history/repair_order_history.get.entity";
import { RepairOrderHistoryService } from "../repair_order_history/repair_order_history.service";
import { RepairItem } from "../repair_item/repair_item.entity";
import { RepairItemGet } from "../repair_item/repair_item.get.entity";
import { RepairItemService } from "../repair_item/repair_item.service";
import { RepairRecord } from "../repair_record/repair_record.entity";
import { RepairRecordGet } from "../repair_record/repair_record.get.entity";
import { RepairRecordService } from "../repair_record/repair_record.service";
import { Mail } from "../mail/mail.entity";
import { MailGet } from "../mail/mail.get.entity";
import { MailService } from "../mail/mail.service";

import { RepairOrderService } from "./repair_order.service";
import { GetRepairOrderArgs } from "./repair_order.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetDomainArgs } from "../domain/domain.args";
import { GetUserArgs } from "../user/user.args";
import { GetRepairOrderHistoryArgs } from "../repair_order_history/repair_order_history.args";
import { GetRepairItemArgs } from "../repair_item/repair_item.args";
import { GetRepairRecordArgs } from "../repair_record/repair_record.args";
import { GetMailArgs } from "../mail/mail.args";


@Resolver(of => RepairOrderGet)
export class RepairOrdersResolverBase {
  constructor(
    public readonly repairOrderService: RepairOrderService,
    public readonly domainService: DomainService,
    public readonly userService: UserService,
    public readonly repairOrderHistoryService: RepairOrderHistoryService,
    public readonly repairItemService: RepairItemService,
    public readonly repairRecordService: RepairRecordService,
    public readonly mailService: MailService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [RepairOrderGet])
  repair_orders(
    @Context() context,
    @Args() args: GetRepairOrderArgs
    //parent, args, contextValue, info
  ): Promise<RepairOrderGet[]> {
    var service:any = this.repairOrderService
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
  @Query(returns => RepairOrderGet, { nullable: true })
  async repair_order(@Context() context, @Args('repair_order_id', {type:()=>Int}) repair_order_id:number):Promise<RepairOrderGet|null> {
    var service:any = this.repairOrderService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, repair_order_id);
  }


  @ResolveField('domain', returns => DomainGet, {nullable: true})
  async domain(@Context() context, @Parent() repair_order: RepairOrderGet): Promise<DomainGet|null> {
    const { domain_id } = repair_order;
    var service:any = this.domainService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (domain_id==null)?null:findOne(context.req?.user, domain_id);
  }

  @ResolveField('creator', returns => UserGet, {nullable: true})
  async creator(@Context() context, @Parent() repair_order: RepairOrderGet): Promise<UserGet|null> {
    const { creator_id } = repair_order;
    var service:any = this.userService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (creator_id==null)?null:findOne(context.req?.user, creator_id);
  }

  @ResolveField('supplier', returns => UserGet, {nullable: true})
  async supplier(@Context() context, @Parent() repair_order: RepairOrderGet): Promise<UserGet|null> {
    const { supplier_id } = repair_order;
    var service:any = this.userService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (supplier_id==null)?null:findOne(context.req?.user, supplier_id);
  }

  @ResolveField('assign_user', returns => UserGet, {nullable: true})
  async assign_user(@Context() context, @Parent() repair_order: RepairOrderGet): Promise<UserGet|null> {
    const { assign_user_id } = repair_order;
    var service:any = this.userService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (assign_user_id==null)?null:findOne(context.req?.user, assign_user_id);
  }

  @ResolveField('repair_order_historys', returns => [RepairOrderHistoryGet], {nullable:true})
  async repair_order_historys(
      @Context() context,
      @Parent() repair_order: RepairOrderGet,
      @Args() args: GetRepairOrderHistoryArgs
    ): Promise<Array<RepairOrderHistoryGet|null>> {
    const {repair_order_id} = repair_order;
    if (repair_order_id==null) return null;
    if (args==null) args = {}
    args.repair_order_id = repair_order_id;
    var service:any = this.repairOrderHistoryService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('repair_items', returns => [RepairItemGet], {nullable:true})
  async repair_items(
      @Context() context,
      @Parent() repair_order: RepairOrderGet,
      @Args() args: GetRepairItemArgs
    ): Promise<Array<RepairItemGet|null>> {
    const {repair_order_id} = repair_order;
    if (repair_order_id==null) return null;
    if (args==null) args = {}
    args.repair_order_id = repair_order_id;
    var service:any = this.repairItemService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('repair_records', returns => [RepairRecordGet], {nullable:true})
  async repair_records(
      @Context() context,
      @Parent() repair_order: RepairOrderGet,
      @Args() args: GetRepairRecordArgs
    ): Promise<Array<RepairRecordGet|null>> {
    const {repair_order_id} = repair_order;
    if (repair_order_id==null) return null;
    if (args==null) args = {}
    args.repair_order_id = repair_order_id;
    var service:any = this.repairRecordService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('mails', returns => [MailGet], {nullable:true})
  async mails(
      @Context() context,
      @Parent() repair_order: RepairOrderGet,
      @Args() args: GetMailArgs
    ): Promise<Array<MailGet|null>> {
    const {repair_order_id} = repair_order;
    if (repair_order_id==null) return null;
    if (args==null) args = {}
    args.repair_order_id = repair_order_id;
    var service:any = this.mailService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                

}