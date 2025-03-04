import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { PagePermission } from './page_permission.entity';

import { PagePermissionsResolverBase } from "./page_permission.resolver.base";
import { PagePermissionService } from "./page_permission.service";
import { PagePermissionGet } from "./page_permission.get.entity";

@Resolver(of => PagePermissionGet)
export class PagePermissionsResolver extends PagePermissionsResolverBase {
  constructor(
    public readonly pagePermissionService: PagePermissionService,

  ) {
    super(pagePermissionService)
  }

}