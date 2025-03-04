import { Resolver, Query, ID, Args, Int, ResolveField, Parent } from "@nestjs/graphql";

import { User } from './user.entity';
import { UserGet } from './user.get.entity';
import { UserPermission } from "../user_permission/user_permission.entity";
import { UserPermissionService } from "../user_permission/user_permission.service";
import { RepairOrderHistory } from "../repair_order_history/repair_order_history.entity";
import { RepairOrderHistoryService } from "../repair_order_history/repair_order_history.service";
import { RepairUserRecord } from "../repair_user_record/repair_user_record.entity";
import { RepairUserRecordService } from "../repair_user_record/repair_user_record.service";

import { UserService } from "./user.service";

@Resolver(of => UserGet)
export class UsersResolverBase {
  constructor(
    public readonly userService: UserService,
    public readonly userPermissionService: UserPermissionService,
    public readonly repairOrderHistoryService: RepairOrderHistoryService,
    public readonly repairUserRecordService: RepairUserRecordService,

  ) {}

  @Query(returns => [User])
  users(parent, args, contextValue, info): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(returns => User, { nullable: true })
  async user(@Args('user_id', {type:()=>Int}) user_id:number):Promise<User|null> {
    return this.userService.findOne(user_id);
  }


  @ResolveField('user_permissions', returns => [UserPermission], {nullable:true})
  async user_permissions(@Parent() user: User): Promise<Array<UserPermission|null>> {
    const {user_id} = user;
    return (user_id==null)?null:this.userPermissionService.findAll({
      where: {
        user_id: user_id
      },
    });
  }
                
  @ResolveField('repair_order_historys', returns => [RepairOrderHistory], {nullable:true})
  async repair_order_historys(@Parent() user: User): Promise<Array<RepairOrderHistory|null>> {
    const {user_id} = user;
    return (user_id==null)?null:this.repairOrderHistoryService.findAll({
      where: {
        user_id: user_id
      },
    });
  }
                
  @ResolveField('repair_user_records', returns => [RepairUserRecord], {nullable:true})
  async repair_user_records(@Parent() user: User): Promise<Array<RepairUserRecord|null>> {
    const {user_id} = user;
    return (user_id==null)?null:this.repairUserRecordService.findAll({
      where: {
        user_id: user_id
      },
    });
  }
                

}