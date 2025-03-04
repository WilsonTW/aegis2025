import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { DeviceTypeCategoryGet } from './device_type_category.get.entity';
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeGet } from "../device_type/device_type.get.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { Device } from "../device/device.entity";
import { DeviceGet } from "../device/device.get.entity";
import { DeviceService } from "../device/device.service";

import { DeviceTypeCategoryService } from "./device_type_category.service";
import { GetDeviceTypeCategoryArgs } from "./device_type_category.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetDeviceTypeArgs } from "../device_type/device_type.args";
import { GetDeviceArgs } from "../device/device.args";


@Resolver(of => DeviceTypeCategoryGet)
export class DeviceTypeCategorysResolverBase {
  constructor(
    public readonly deviceTypeCategoryService: DeviceTypeCategoryService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceService: DeviceService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [DeviceTypeCategoryGet])
  device_type_categorys(
    @Context() context,
    @Args() args: GetDeviceTypeCategoryArgs
    //parent, args, contextValue, info
  ): Promise<DeviceTypeCategoryGet[]> {
    var service:any = this.deviceTypeCategoryService
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
  @Query(returns => DeviceTypeCategoryGet, { nullable: true })
  async device_type_category(@Context() context, @Args('device_type_category_id', {type:()=>Int}) device_type_category_id:number):Promise<DeviceTypeCategoryGet|null> {
    var service:any = this.deviceTypeCategoryService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, device_type_category_id);
  }


  @ResolveField('device_types', returns => [DeviceTypeGet], {nullable:true})
  async device_types(
      @Context() context,
      @Parent() device_type_category: DeviceTypeCategoryGet,
      @Args() args: GetDeviceTypeArgs
    ): Promise<Array<DeviceTypeGet|null>> {
    const {device_type_category_id} = device_type_category;
    if (device_type_category_id==null) return null;
    if (args==null) args = {}
    args.device_type_category_id = device_type_category_id;
    var service:any = this.deviceTypeService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('devices', returns => [DeviceGet], {nullable:true})
  async devices(
      @Context() context,
      @Parent() device_type_category: DeviceTypeCategoryGet,
      @Args() args: GetDeviceArgs
    ): Promise<Array<DeviceGet|null>> {
    const {device_type_category_id} = device_type_category;
    if (device_type_category_id==null) return null;
    if (args==null) args = {}
    args.device_type_category_id = device_type_category_id;
    var service:any = this.deviceService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                

}