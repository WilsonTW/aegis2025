import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { DeviceOutputGet } from './device_output.get.entity';
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeGet } from "../device_type/device_type.get.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { DeviceInput } from "../device_input/device_input.entity";
import { DeviceInputGet } from "../device_input/device_input.get.entity";
import { DeviceInputService } from "../device_input/device_input.service";
import { Event } from "../event/event.entity";
import { EventGet } from "../event/event.get.entity";
import { EventService } from "../event/event.service";

import { DeviceOutputService } from "./device_output.service";
import { GetDeviceOutputArgs } from "./device_output.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetDeviceTypeArgs } from "../device_type/device_type.args";
import { GetDeviceInputArgs } from "../device_input/device_input.args";
import { GetEventArgs } from "../event/event.args";


@Resolver(of => DeviceOutputGet)
export class DeviceOutputsResolverBase {
  constructor(
    public readonly deviceOutputService: DeviceOutputService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceInputService: DeviceInputService,
    public readonly eventService: EventService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [DeviceOutputGet])
  device_outputs(
    @Context() context,
    @Args() args: GetDeviceOutputArgs
    //parent, args, contextValue, info
  ): Promise<DeviceOutputGet[]> {
    var service:any = this.deviceOutputService
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
  @Query(returns => DeviceOutputGet, { nullable: true })
  async device_output(@Context() context, @Args('device_output_id', {type:()=>Int}) device_output_id:number):Promise<DeviceOutputGet|null> {
    var service:any = this.deviceOutputService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, device_output_id);
  }


  @ResolveField('device_type', returns => DeviceTypeGet, {nullable: true})
  async device_type(@Context() context, @Parent() device_output: DeviceOutputGet): Promise<DeviceTypeGet|null> {
    const { device_type_id } = device_output;
    var service:any = this.deviceTypeService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (device_type_id==null)?null:findOne(context.req?.user, device_type_id);
  }

  @ResolveField('device_inputs', returns => [DeviceInputGet], {nullable:true})
  async device_inputs(
      @Context() context,
      @Parent() device_output: DeviceOutputGet,
      @Args() args: GetDeviceInputArgs
    ): Promise<Array<DeviceInputGet|null>> {
    const {device_output_id} = device_output;
    if (device_output_id==null) return null;
    if (args==null) args = {}
    args.response_output_id = device_output_id;
    var service:any = this.deviceInputService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('events', returns => [EventGet], {nullable:true})
  async events(
      @Context() context,
      @Parent() device_output: DeviceOutputGet,
      @Args() args: GetEventArgs
    ): Promise<Array<EventGet|null>> {
    const {device_output_id} = device_output;
    if (device_output_id==null) return null;
    if (args==null) args = {}
    args.device_output_id = device_output_id;
    var service:any = this.eventService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                

}