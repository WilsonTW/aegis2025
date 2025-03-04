import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { SettingGet } from './setting.get.entity';

import { SettingService } from "./setting.service";
import { GetSettingArgs } from "./setting.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";


@Resolver(of => SettingGet)
export class SettingsResolverBase {
  constructor(
    public readonly settingService: SettingService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [SettingGet])
  settings(
    @Context() context,
    @Args() args: GetSettingArgs
    //parent, args, contextValue, info
  ): Promise<SettingGet[]> {
    var service:any = this.settingService
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
  @Query(returns => SettingGet, { nullable: true })
  async setting(@Context() context, @Args('setting_id', {type:()=>String}) setting_id:string):Promise<SettingGet|null> {
    var service:any = this.settingService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, setting_id);
  }



}