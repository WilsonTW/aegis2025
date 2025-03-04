import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { DeviceMeterGet } from './device_meter.get.entity';
//--- @(reference_import) ---
import { DeviceMeterService } from "./device_meter.service";
import { GetDeviceMeterArgs } from "./device_meter.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
//--- @(reference_args_import) ---

@Resolver(of => DeviceMeterGet)
export class DeviceMetersResolverBase {
  constructor(
    public readonly deviceMeterService: DeviceMeterService,
//--- @(reference_service) ---
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [DeviceMeterGet])
  device_meters(
    @Context() context,
    @Args() args: GetDeviceMeterArgs
    //parent, args, contextValue, info
  ): Promise<DeviceMeterGet[]> {
    var service:any = this.deviceMeterService
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
  @Query(returns => DeviceMeterGet, { nullable: true })
  async device_meter(@Context() context, @Args('device_meter_id', {type:()=>Int}) device_meter_id:number):Promise<DeviceMeterGet|null> {
    var service:any = this.deviceMeterService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, device_meter_id);
  }

//--- @(resolve_field) ---

}