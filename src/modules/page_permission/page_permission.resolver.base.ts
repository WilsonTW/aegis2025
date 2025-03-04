import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { PagePermissionGet } from './page_permission.get.entity';

import { PagePermissionService } from "./page_permission.service";
import { GetPagePermissionArgs } from "./page_permission.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";


@Resolver(of => PagePermissionGet)
export class PagePermissionsResolverBase {
  constructor(
    public readonly pagePermissionService: PagePermissionService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [PagePermissionGet])
  page_permissions(
    @Context() context,
    @Args() args: GetPagePermissionArgs
    //parent, args, contextValue, info
  ): Promise<PagePermissionGet[]> {
    var service:any = this.pagePermissionService
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
  @Query(returns => PagePermissionGet, { nullable: true })
  async page_permission(@Context() context, @Args('page_permission_id', {type:()=>Int}) page_permission_id:number):Promise<PagePermissionGet|null> {
    var service:any = this.pagePermissionService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, page_permission_id);
  }



}