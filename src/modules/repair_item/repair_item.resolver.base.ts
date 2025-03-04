import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { RepairItemGet } from './repair_item.get.entity';
import { RepairType } from "../repair_type/repair_type.entity";
import { RepairTypeGet } from "../repair_type/repair_type.get.entity";
import { RepairTypeService } from "../repair_type/repair_type.service";
import { RepairOrder } from "../repair_order/repair_order.entity";
import { RepairOrderGet } from "../repair_order/repair_order.get.entity";
import { RepairOrderService } from "../repair_order/repair_order.service";
import { Device } from "../device/device.entity";
import { DeviceGet } from "../device/device.get.entity";
import { DeviceService } from "../device/device.service";
import { RepairRecord } from "../repair_record/repair_record.entity";
import { RepairRecordGet } from "../repair_record/repair_record.get.entity";
import { RepairRecordService } from "../repair_record/repair_record.service";

import { RepairItemService } from "./repair_item.service";
import { GetRepairItemArgs } from "./repair_item.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetRepairTypeArgs } from "../repair_type/repair_type.args";
import { GetRepairOrderArgs } from "../repair_order/repair_order.args";
import { GetDeviceArgs } from "../device/device.args";
import { GetRepairRecordArgs } from "../repair_record/repair_record.args";


@Resolver(of => RepairItemGet)
export class RepairItemsResolverBase {
  constructor(
    public readonly repairItemService: RepairItemService,
    public readonly repairTypeService: RepairTypeService,
    public readonly repairOrderService: RepairOrderService,
    public readonly deviceService: DeviceService,
    public readonly repairRecordService: RepairRecordService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [RepairItemGet])
  repair_items(
    @Context() context,
    @Args() args: GetRepairItemArgs
    //parent, args, contextValue, info
  ): Promise<RepairItemGet[]> {
    var service:any = this.repairItemService
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
  @Query(returns => RepairItemGet, { nullable: true })
  async repair_item(@Context() context, @Args('repair_item_id', {type:()=>Int}) repair_item_id:number):Promise<RepairItemGet|null> {
    var service:any = this.repairItemService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, repair_item_id);
  }


  @ResolveField('repair_type', returns => RepairTypeGet, {nullable: true})
  async repair_type(@Context() context, @Parent() repair_item: RepairItemGet): Promise<RepairTypeGet|null> {
    const { repair_type_id } = repair_item;
    var service:any = this.repairTypeService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (repair_type_id==null)?null:findOne(context.req?.user, repair_type_id);
  }

  @ResolveField('repair_order', returns => RepairOrderGet, {nullable: true})
  async repair_order(@Context() context, @Parent() repair_item: RepairItemGet): Promise<RepairOrderGet|null> {
    const { repair_order_id } = repair_item;
    var service:any = this.repairOrderService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (repair_order_id==null)?null:findOne(context.req?.user, repair_order_id);
  }

  @ResolveField('device', returns => DeviceGet, {nullable: true})
  async device(@Context() context, @Parent() repair_item: RepairItemGet): Promise<DeviceGet|null> {
    const { device_id } = repair_item;
    var service:any = this.deviceService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (device_id==null)?null:findOne(context.req?.user, device_id);
  }

  @ResolveField('repair_records', returns => [RepairRecordGet], {nullable:true})
  async repair_records(
      @Context() context,
      @Parent() repair_item: RepairItemGet,
      @Args() args: GetRepairRecordArgs
    ): Promise<Array<RepairRecordGet|null>> {
    const {repair_item_id} = repair_item;
    if (repair_item_id==null) return null;
    if (args==null) args = {}
    args.repair_item_id = repair_item_id;
    var service:any = this.repairRecordService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                

}