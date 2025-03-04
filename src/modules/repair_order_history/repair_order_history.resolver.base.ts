import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { RepairOrderHistoryGet } from './repair_order_history.get.entity';
import { RepairOrder } from "../repair_order/repair_order.entity";
import { RepairOrderGet } from "../repair_order/repair_order.get.entity";
import { RepairOrderService } from "../repair_order/repair_order.service";
import { User } from "../user/user.entity";
import { UserGet } from "../user/user.get.entity";
import { UserService } from "../user/user.service";

import { RepairOrderHistoryService } from "./repair_order_history.service";
import { GetRepairOrderHistoryArgs } from "./repair_order_history.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetRepairOrderArgs } from "../repair_order/repair_order.args";
import { GetUserArgs } from "../user/user.args";


@Resolver(of => RepairOrderHistoryGet)
export class RepairOrderHistorysResolverBase {
  constructor(
    public readonly repairOrderHistoryService: RepairOrderHistoryService,
    public readonly repairOrderService: RepairOrderService,
    public readonly userService: UserService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [RepairOrderHistoryGet])
  repair_order_historys(
    @Context() context,
    @Args() args: GetRepairOrderHistoryArgs
    //parent, args, contextValue, info
  ): Promise<RepairOrderHistoryGet[]> {
    var service:any = this.repairOrderHistoryService
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
  @Query(returns => RepairOrderHistoryGet, { nullable: true })
  async repair_order_history(@Context() context, @Args('repair_order_history_id', {type:()=>Int}) repair_order_history_id:number):Promise<RepairOrderHistoryGet|null> {
    var service:any = this.repairOrderHistoryService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, repair_order_history_id);
  }


  @ResolveField('repair_order', returns => RepairOrderGet, {nullable: true})
  async repair_order(@Context() context, @Parent() repair_order_history: RepairOrderHistoryGet): Promise<RepairOrderGet|null> {
    const { repair_order_id } = repair_order_history;
    var service:any = this.repairOrderService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (repair_order_id==null)?null:findOne(context.req?.user, repair_order_id);
  }

  @ResolveField('user', returns => UserGet, {nullable: true})
  async user(@Context() context, @Parent() repair_order_history: RepairOrderHistoryGet): Promise<UserGet|null> {
    const { user_id } = repair_order_history;
    var service:any = this.userService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (user_id==null)?null:findOne(context.req?.user, user_id);
  }


}