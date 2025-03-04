import { Resolver, Query, ID, Args, Int, ResolveField, Parent, Context } from "@nestjs/graphql";

import { RoleGet } from './role.get.entity';
import { Domain } from "../domain/domain.entity";
import { DomainGet } from "../domain/domain.get.entity";
import { DomainService } from "../domain/domain.service";
import { User } from "../user/user.entity";
import { UserGet } from "../user/user.get.entity";
import { UserService } from "../user/user.service";

import { RoleService } from "./role.service";
import { GetRoleArgs } from "./role.args";
import { GqlAuthGuard } from "src/modules/auth/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { GetDomainArgs } from "../domain/domain.args";
import { GetUserArgs } from "../user/user.args";


@Resolver(of => RoleGet)
export class RolesResolverBase {
  constructor(
    public readonly roleService: RoleService,
    public readonly domainService: DomainService,
    public readonly userService: UserService,

  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [RoleGet])
  roles(
    @Context() context,
    @Args() args: GetRoleArgs
    //parent, args, contextValue, info
  ): Promise<RoleGet[]> {
    var service:any = this.roleService
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
  @Query(returns => RoleGet, { nullable: true })
  async role(@Context() context, @Args('role_id', {type:()=>Int}) role_id:number):Promise<RoleGet|null> {
    var service:any = this.roleService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return findOne(context.req?.user, role_id);
  }


  @ResolveField('domain', returns => DomainGet, {nullable: true})
  async domain(@Context() context, @Parent() role: RoleGet): Promise<DomainGet|null> {
    const { domain_id } = role;
    var service:any = this.domainService
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (domain_id==null)?null:findOne(context.req?.user, domain_id);
  }

  @ResolveField('users', returns => [UserGet], {nullable:true})
  async users(
      @Context() context,
      @Parent() role: RoleGet,
      @Args() args: GetUserArgs
    ): Promise<Array<UserGet|null>> {
    const {role_id} = role;
    if (role_id==null) return null;
    if (args==null) args = {}
    args.role_id = role_id;
    var service:any = this.userService
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                

}