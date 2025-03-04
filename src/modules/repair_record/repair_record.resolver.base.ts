import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { RepairRecordGet } from './repair_record.get.entity';
import { RepairOrder } from "../repair_order/repair_order.entity";
import { RepairOrderGet } from "../repair_order/repair_order.get.entity";
import { RepairOrderService } from "../repair_order/repair_order.service";
import { RepairItem } from "../repair_item/repair_item.entity";
import { RepairItemGet } from "../repair_item/repair_item.get.entity";
import { RepairItemService } from "../repair_item/repair_item.service";
import { RepairUserRecord } from "../repair_user_record/repair_user_record.entity";
import { RepairUserRecordGet } from "../repair_user_record/repair_user_record.get.entity";
import { RepairUserRecordService } from "../repair_user_record/repair_user_record.service";

import { RepairRecordService } from "./repair_record.service";
import { GetRepairRecordArgs } from "./repair_record.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetRepairOrderArgs } from "../repair_order/repair_order.args";
import { GetRepairItemArgs } from "../repair_item/repair_item.args";
import { GetRepairUserRecordArgs } from "../repair_user_record/repair_user_record.args";


@Resolver(of => RepairRecordGet)
export class RepairRecordsResolverBase {
  constructor(
    public readonly repairRecordService: RepairRecordService,
    public readonly repairOrderService: RepairOrderService,
    public readonly repairItemService: RepairItemService,
    public readonly repairUserRecordService: RepairUserRecordService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [RepairRecordGet])
  repair_records(
    @Context() context,
    @Args() args: GetRepairRecordArgs
    //parent, args, contextValue, info
  ): Promise<RepairRecordGet[]> {
    var service:any = this.repairRecordService
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
  @Query(returns => RepairRecordGet, { nullable: true })
  async repair_record(@Context() context, @Args('repair_record_id', {type:()=>Int}) repair_record_id:number):Promise<RepairRecordGet|null> {
    var service:any = this.repairRecordService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, repair_record_id);
  }


  @ResolveField('repair_order', returns => RepairOrderGet, {nullable: true})
  async repair_order(@Context() context, @Parent() repair_record: RepairRecordGet): Promise<RepairOrderGet|null> {
    const { repair_order_id } = repair_record;
    var service:any = this.repairOrderService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (repair_order_id==null)?null:findOne(context.req?.user, repair_order_id);
  }

  @ResolveField('repair_item', returns => RepairItemGet, {nullable: true})
  async repair_item(@Context() context, @Parent() repair_record: RepairRecordGet): Promise<RepairItemGet|null> {
    const { repair_item_id } = repair_record;
    var service:any = this.repairItemService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (repair_item_id==null)?null:findOne(context.req?.user, repair_item_id);
  }

  @ResolveField('repair_user_records', returns => [RepairUserRecordGet], {nullable:true})
  async repair_user_records(
      @Context() context,
      @Parent() repair_record: RepairRecordGet,
      @Args() args: GetRepairUserRecordArgs
    ): Promise<Array<RepairUserRecordGet|null>> {
    const {repair_record_id} = repair_record;
    if (repair_record_id==null) return null;
    if (args==null) args = {}
    args.repair_record_id = repair_record_id;
    var service:any = this.repairUserRecordService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                

}