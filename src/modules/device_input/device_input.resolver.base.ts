import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { DeviceInputGet } from './device_input.get.entity';
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeGet } from "../device_type/device_type.get.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { DeviceOutput } from "../device_output/device_output.entity";
import { DeviceOutputGet } from "../device_output/device_output.get.entity";
import { DeviceOutputService } from "../device_output/device_output.service";
import { Scheduler } from "../scheduler/scheduler.entity";
import { SchedulerGet } from "../scheduler/scheduler.get.entity";
import { SchedulerService } from "../scheduler/scheduler.service";

import { DeviceInputService } from "./device_input.service";
import { GetDeviceInputArgs } from "./device_input.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetDeviceTypeArgs } from "../device_type/device_type.args";
import { GetDeviceOutputArgs } from "../device_output/device_output.args";
import { GetSchedulerArgs } from "../scheduler/scheduler.args";


@Resolver(of => DeviceInputGet)
export class DeviceInputsResolverBase {
  constructor(
    public readonly deviceInputService: DeviceInputService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceOutputService: DeviceOutputService,
    public readonly schedulerService: SchedulerService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [DeviceInputGet])
  device_inputs(
    @Context() context,
    @Args() args: GetDeviceInputArgs
    //parent, args, contextValue, info
  ): Promise<DeviceInputGet[]> {
    var service:any = this.deviceInputService
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
  @Query(returns => DeviceInputGet, { nullable: true })
  async device_input(@Context() context, @Args('device_input_id', {type:()=>Int}) device_input_id:number):Promise<DeviceInputGet|null> {
    var service:any = this.deviceInputService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, device_input_id);
  }


  @ResolveField('device_type', returns => DeviceTypeGet, {nullable: true})
  async device_type(@Context() context, @Parent() device_input: DeviceInputGet): Promise<DeviceTypeGet|null> {
    const { device_type_id } = device_input;
    var service:any = this.deviceTypeService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (device_type_id==null)?null:findOne(context.req?.user, device_type_id);
  }

  @ResolveField('response_output', returns => DeviceOutputGet, {nullable: true})
  async response_output(@Context() context, @Parent() device_input: DeviceInputGet): Promise<DeviceOutputGet|null> {
    const { response_output_id } = device_input;
    var service:any = this.deviceOutputService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (response_output_id==null)?null:findOne(context.req?.user, response_output_id);
  }

  @ResolveField('schedulers', returns => [SchedulerGet], {nullable:true})
  async schedulers(
      @Context() context,
      @Parent() device_input: DeviceInputGet,
      @Args() args: GetSchedulerArgs
    ): Promise<Array<SchedulerGet|null>> {
    const {device_input_id} = device_input;
    if (device_input_id==null) return null;
    if (args==null) args = {}
    args.device_input_id = device_input_id;
    var service:any = this.schedulerService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                

}