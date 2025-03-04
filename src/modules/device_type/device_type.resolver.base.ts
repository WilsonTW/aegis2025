import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { DeviceTypeGet } from './device_type.get.entity';
import { DeviceTypeCategory } from "../device_type_category/device_type_category.entity";
import { DeviceTypeCategoryGet } from "../device_type_category/device_type_category.get.entity";
import { DeviceTypeCategoryService } from "../device_type_category/device_type_category.service";
import { DeviceConnection } from "../device_connection/device_connection.entity";
import { DeviceConnectionGet } from "../device_connection/device_connection.get.entity";
import { DeviceConnectionService } from "../device_connection/device_connection.service";
import { DeviceOutput } from "../device_output/device_output.entity";
import { DeviceOutputGet } from "../device_output/device_output.get.entity";
import { DeviceOutputService } from "../device_output/device_output.service";
import { DeviceInput } from "../device_input/device_input.entity";
import { DeviceInputGet } from "../device_input/device_input.get.entity";
import { DeviceInputService } from "../device_input/device_input.service";
import { Device } from "../device/device.entity";
import { DeviceGet } from "../device/device.get.entity";
import { DeviceService } from "../device/device.service";
import { Scheduler } from "../scheduler/scheduler.entity";
import { SchedulerGet } from "../scheduler/scheduler.get.entity";
import { SchedulerService } from "../scheduler/scheduler.service";
import { RepairType } from "../repair_type/repair_type.entity";
import { RepairTypeGet } from "../repair_type/repair_type.get.entity";
import { RepairTypeService } from "../repair_type/repair_type.service";
import { Event } from "../event/event.entity";
import { EventGet } from "../event/event.get.entity";
import { EventService } from "../event/event.service";

import { DeviceTypeService } from "./device_type.service";
import { GetDeviceTypeArgs } from "./device_type.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetDeviceTypeCategoryArgs } from "../device_type_category/device_type_category.args";
import { GetDeviceConnectionArgs } from "../device_connection/device_connection.args";
import { GetDeviceOutputArgs } from "../device_output/device_output.args";
import { GetDeviceInputArgs } from "../device_input/device_input.args";
import { GetDeviceArgs } from "../device/device.args";
import { GetSchedulerArgs } from "../scheduler/scheduler.args";
import { GetRepairTypeArgs } from "../repair_type/repair_type.args";
import { GetEventArgs } from "../event/event.args";


@Resolver(of => DeviceTypeGet)
export class DeviceTypesResolverBase {
  constructor(
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceTypeCategoryService: DeviceTypeCategoryService,
    public readonly deviceConnectionService: DeviceConnectionService,
    public readonly deviceOutputService: DeviceOutputService,
    public readonly deviceInputService: DeviceInputService,
    public readonly deviceService: DeviceService,
    public readonly schedulerService: SchedulerService,
    public readonly repairTypeService: RepairTypeService,
    public readonly eventService: EventService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [DeviceTypeGet])
  device_types(
    @Context() context,
    @Args() args: GetDeviceTypeArgs
    //parent, args, contextValue, info
  ): Promise<DeviceTypeGet[]> {
    var service:any = this.deviceTypeService
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
  @Query(returns => DeviceTypeGet, { nullable: true })
  async device_type(@Context() context, @Args('device_type_id', {type:()=>Int}) device_type_id:number):Promise<DeviceTypeGet|null> {
    var service:any = this.deviceTypeService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, device_type_id);
  }


  @ResolveField('device_type_category', returns => DeviceTypeCategoryGet, {nullable: true})
  async device_type_category(@Context() context, @Parent() device_type: DeviceTypeGet): Promise<DeviceTypeCategoryGet|null> {
    const { device_type_category_id } = device_type;
    var service:any = this.deviceTypeCategoryService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (device_type_category_id==null)?null:findOne(context.req?.user, device_type_category_id);
  }

  @ResolveField('device_connections', returns => [DeviceConnectionGet], {nullable:true})
  async device_connections(
      @Context() context,
      @Parent() device_type: DeviceTypeGet,
      @Args() args: GetDeviceConnectionArgs
    ): Promise<Array<DeviceConnectionGet|null>> {
    const {device_type_id} = device_type;
    if (device_type_id==null) return null;
    if (args==null) args = {}
    args.device_type_id = device_type_id;
    var service:any = this.deviceConnectionService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('device_outputs', returns => [DeviceOutputGet], {nullable:true})
  async device_outputs(
      @Context() context,
      @Parent() device_type: DeviceTypeGet,
      @Args() args: GetDeviceOutputArgs
    ): Promise<Array<DeviceOutputGet|null>> {
    const {device_type_id} = device_type;
    if (device_type_id==null) return null;
    if (args==null) args = {}
    args.device_type_id = device_type_id;
    var service:any = this.deviceOutputService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('device_inputs', returns => [DeviceInputGet], {nullable:true})
  async device_inputs(
      @Context() context,
      @Parent() device_type: DeviceTypeGet,
      @Args() args: GetDeviceInputArgs
    ): Promise<Array<DeviceInputGet|null>> {
    const {device_type_id} = device_type;
    if (device_type_id==null) return null;
    if (args==null) args = {}
    args.device_type_id = device_type_id;
    var service:any = this.deviceInputService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('devices', returns => [DeviceGet], {nullable:true})
  async devices(
      @Context() context,
      @Parent() device_type: DeviceTypeGet,
      @Args() args: GetDeviceArgs
    ): Promise<Array<DeviceGet|null>> {
    const {device_type_id} = device_type;
    if (device_type_id==null) return null;
    if (args==null) args = {}
    args.device_type_id = device_type_id;
    var service:any = this.deviceService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('schedulers', returns => [SchedulerGet], {nullable:true})
  async schedulers(
      @Context() context,
      @Parent() device_type: DeviceTypeGet,
      @Args() args: GetSchedulerArgs
    ): Promise<Array<SchedulerGet|null>> {
    const {device_type_id} = device_type;
    if (device_type_id==null) return null;
    if (args==null) args = {}
    args.device_type_id = device_type_id;
    var service:any = this.schedulerService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('repair_types', returns => [RepairTypeGet], {nullable:true})
  async repair_types(
      @Context() context,
      @Parent() device_type: DeviceTypeGet,
      @Args() args: GetRepairTypeArgs
    ): Promise<Array<RepairTypeGet|null>> {
    const {device_type_id} = device_type;
    if (device_type_id==null) return null;
    if (args==null) args = {}
    args.device_type_id = device_type_id;
    var service:any = this.repairTypeService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                
  @ResolveField('events', returns => [EventGet], {nullable:true})
  async events(
      @Context() context,
      @Parent() device_type: DeviceTypeGet,
      @Args() args: GetEventArgs
    ): Promise<Array<EventGet|null>> {
    const {device_type_id} = device_type;
    if (device_type_id==null) return null;
    if (args==null) args = {}
    args.device_type_id = device_type_id;
    var service:any = this.eventService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                

}