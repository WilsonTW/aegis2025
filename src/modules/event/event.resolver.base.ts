import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { EventGet } from './event.get.entity';
import { Domain } from "../domain/domain.entity";
import { DomainGet } from "../domain/domain.get.entity";
import { DomainService } from "../domain/domain.service";
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeGet } from "../device_type/device_type.get.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { DeviceOutput } from "../device_output/device_output.entity";
import { DeviceOutputGet } from "../device_output/device_output.get.entity";
import { DeviceOutputService } from "../device_output/device_output.service";

import { EventService } from "./event.service";
import { GetEventArgs } from "./event.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetDomainArgs } from "../domain/domain.args";
import { GetDeviceTypeArgs } from "../device_type/device_type.args";
import { GetDeviceOutputArgs } from "../device_output/device_output.args";


@Resolver(of => EventGet)
export class EventsResolverBase {
  constructor(
    public readonly eventService: EventService,
    public readonly domainService: DomainService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceOutputService: DeviceOutputService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [EventGet])
  events(
    @Context() context,
    @Args() args: GetEventArgs
    //parent, args, contextValue, info
  ): Promise<EventGet[]> {
    var service:any = this.eventService
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
  @Query(returns => EventGet, { nullable: true })
  async event(@Context() context, @Args('event_id', {type:()=>Int}) event_id:number):Promise<EventGet|null> {
    var service:any = this.eventService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, event_id);
  }


  @ResolveField('domain', returns => DomainGet, {nullable: true})
  async domain(@Context() context, @Parent() event: EventGet): Promise<DomainGet|null> {
    const { domain_id } = event;
    var service:any = this.domainService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (domain_id==null)?null:findOne(context.req?.user, domain_id);
  }

  @ResolveField('device_type', returns => DeviceTypeGet, {nullable: true})
  async device_type(@Context() context, @Parent() event: EventGet): Promise<DeviceTypeGet|null> {
    const { device_type_id } = event;
    var service:any = this.deviceTypeService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (device_type_id==null)?null:findOne(context.req?.user, device_type_id);
  }

  @ResolveField('device_output', returns => DeviceOutputGet, {nullable: true})
  async device_output(@Context() context, @Parent() event: EventGet): Promise<DeviceOutputGet|null> {
    const { device_output_id } = event;
    var service:any = this.deviceOutputService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (device_output_id==null)?null:findOne(context.req?.user, device_output_id);
  }


}