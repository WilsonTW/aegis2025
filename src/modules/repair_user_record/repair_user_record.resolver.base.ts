import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { RepairUserRecordGet } from './repair_user_record.get.entity';
import { RepairRecord } from "../repair_record/repair_record.entity";
import { RepairRecordGet } from "../repair_record/repair_record.get.entity";
import { RepairRecordService } from "../repair_record/repair_record.service";
import { User } from "../user/user.entity";
import { UserGet } from "../user/user.get.entity";
import { UserService } from "../user/user.service";

import { RepairUserRecordService } from "./repair_user_record.service";
import { GetRepairUserRecordArgs } from "./repair_user_record.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetRepairRecordArgs } from "../repair_record/repair_record.args";
import { GetUserArgs } from "../user/user.args";


@Resolver(of => RepairUserRecordGet)
export class RepairUserRecordsResolverBase {
  constructor(
    public readonly repairUserRecordService: RepairUserRecordService,
    public readonly repairRecordService: RepairRecordService,
    public readonly userService: UserService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [RepairUserRecordGet])
  repair_user_records(
    @Context() context,
    @Args() args: GetRepairUserRecordArgs
    //parent, args, contextValue, info
  ): Promise<RepairUserRecordGet[]> {
    var service:any = this.repairUserRecordService
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
  @Query(returns => RepairUserRecordGet, { nullable: true })
  async repair_user_record(@Context() context, @Args('repair_user_record_id', {type:()=>Int}) repair_user_record_id:number):Promise<RepairUserRecordGet|null> {
    var service:any = this.repairUserRecordService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, repair_user_record_id);
  }


  @ResolveField('repair_record', returns => RepairRecordGet, {nullable: true})
  async repair_record(@Context() context, @Parent() repair_user_record: RepairUserRecordGet): Promise<RepairRecordGet|null> {
    const { repair_record_id } = repair_user_record;
    var service:any = this.repairRecordService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (repair_record_id==null)?null:findOne(context.req?.user, repair_record_id);
  }

  @ResolveField('user', returns => UserGet, {nullable: true})
  async user(@Context() context, @Parent() repair_user_record: RepairUserRecordGet): Promise<UserGet|null> {
    const { user_id } = repair_user_record;
    var service:any = this.userService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (user_id==null)?null:findOne(context.req?.user, user_id);
  }


}