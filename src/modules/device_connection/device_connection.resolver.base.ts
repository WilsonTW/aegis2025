import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { DeviceConnectionGet } from './device_connection.get.entity';
import { DeviceType } from "../device_type/device_type.entity";
import { DeviceTypeGet } from "../device_type/device_type.get.entity";
import { DeviceTypeService } from "../device_type/device_type.service";
import { Domain } from "../domain/domain.entity";
import { DomainGet } from "../domain/domain.get.entity";
import { DomainService } from "../domain/domain.service";
import { Device } from "../device/device.entity";
import { DeviceGet } from "../device/device.get.entity";
import { DeviceService } from "../device/device.service";

import { DeviceConnectionService } from "./device_connection.service";
import { GetDeviceConnectionArgs } from "./device_connection.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetDeviceTypeArgs } from "../device_type/device_type.args";
import { GetDomainArgs } from "../domain/domain.args";
import { GetDeviceArgs } from "../device/device.args";


@Resolver(of => DeviceConnectionGet)
export class DeviceConnectionsResolverBase {
  constructor(
    public readonly deviceConnectionService: DeviceConnectionService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly domainService: DomainService,
    public readonly deviceService: DeviceService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [DeviceConnectionGet])
  device_connections(
    @Context() context,
    @Args() args: GetDeviceConnectionArgs
    //parent, args, contextValue, info
  ): Promise<DeviceConnectionGet[]> {
    var service:any = this.deviceConnectionService
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
  @Query(returns => DeviceConnectionGet, { nullable: true })
  async device_connection(@Context() context, @Args('device_connection_id', {type:()=>Int}) device_connection_id:number):Promise<DeviceConnectionGet|null> {
    var service:any = this.deviceConnectionService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, device_connection_id);
  }


  @ResolveField('device_type', returns => DeviceTypeGet, {nullable: true})
  async device_type(@Context() context, @Parent() device_connection: DeviceConnectionGet): Promise<DeviceTypeGet|null> {
    const { device_type_id } = device_connection;
    var service:any = this.deviceTypeService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (device_type_id==null)?null:findOne(context.req?.user, device_type_id);
  }

  @ResolveField('organization', returns => DomainGet, {nullable: true})
  async organization(@Context() context, @Parent() device_connection: DeviceConnectionGet): Promise<DomainGet|null> {
    const { organization_id } = device_connection;
    var service:any = this.domainService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (organization_id==null)?null:findOne(context.req?.user, organization_id);
  }

  @ResolveField('devices', returns => [DeviceGet], {nullable:true})
  async devices(
      @Context() context,
      @Parent() device_connection: DeviceConnectionGet,
      @Args() args: GetDeviceArgs
    ): Promise<Array<DeviceGet|null>> {
    const {device_connection_id} = device_connection;
    if (device_connection_id==null) return null;
    if (args==null) args = {}
    args.device_connection_id = device_connection_id;
    var service:any = this.deviceService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                

}