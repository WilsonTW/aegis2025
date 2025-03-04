import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { Role } from './role.entity';
import { Domain } from "../domain/domain.entity";
import { DomainService } from "../domain/domain.service";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";

import { RolesResolverBase } from "./role.resolver.base";
import { RoleService } from "./role.service";
import { RoleGet } from "./role.get.entity";

@Resolver(of => RoleGet)
export class RolesResolver extends RolesResolverBase {
  constructor(
    public readonly roleService: RoleService,
    public readonly domainService: DomainService,
    public readonly userService: UserService,

  ) {
    super(roleService, domainService, userService)
  }

}