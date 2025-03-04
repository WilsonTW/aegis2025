import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { RepairTypeGet } from './repair_type.get.entity';
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeGet } from "../device_type/device_type.get.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { RepairItem } from "../repair_item/repair_item.entity";
import { RepairItemGet } from "../repair_item/repair_item.get.entity";
import { RepairItemService } from "../repair_item/repair_item.service";

import { RepairTypeService } from "./repair_type.service";
import { GetRepairTypeArgs } from "./repair_type.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetDeviceTypeArgs } from "../device_type/device_type.args";
import { GetRepairItemArgs } from "../repair_item/repair_item.args";


@Resolver(of => RepairTypeGet)
export class RepairTypesResolverBase {
  constructor(
    public readonly repairTypeService: RepairTypeService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly repairItemService: RepairItemService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [RepairTypeGet])
  repair_types(
    @Context() context,
    @Args() args: GetRepairTypeArgs
    //parent, args, contextValue, info
  ): Promise<RepairTypeGet[]> {
    var service:any = this.repairTypeService
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
  @Query(returns => RepairTypeGet, { nullable: true })
  async repair_type(@Context() context, @Args('repair_type_id', {type:()=>Int}) repair_type_id:number):Promise<RepairTypeGet|null> {
    var service:any = this.repairTypeService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, repair_type_id);
  }


  @ResolveField('device_type', returns => DeviceTypeGet, {nullable: true})
  async device_type(@Context() context, @Parent() repair_type: RepairTypeGet): Promise<DeviceTypeGet|null> {
    const { device_type_id } = repair_type;
    var service:any = this.deviceTypeService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (device_type_id==null)?null:findOne(context.req?.user, device_type_id);
  }

  @ResolveField('repair_items', returns => [RepairItemGet], {nullable:true})
  async repair_items(
      @Context() context,
      @Parent() repair_type: RepairTypeGet,
      @Args() args: GetRepairItemArgs
    ): Promise<Array<RepairItemGet|null>> {
    const {repair_type_id} = repair_type;
    if (repair_type_id==null) return null;
    if (args==null) args = {}
    args.repair_type_id = repair_type_id;
    var service:any = this.repairItemService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                

}