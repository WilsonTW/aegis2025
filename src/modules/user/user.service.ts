import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Column, Repository } from 'typeorm';
import { User, UserUpdate } from './user.entity';
import { UserServiceBase } from './user.service.base';
import { UserWithPermission } from './user_with_permission.entity';
import { DomainService } from '../domain/domain.service';
import { GetUserArgs } from './user.args';
import { RoleService } from '../role/role.service';
import { Util } from 'src/util/util';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { UserGet } from './user.get.entity';

@Injectable()
export class UserService extends UserServiceBase {
  constructor(
    @InjectRepository(User) public readonly userRepository: Repository<User>,
    private readonly domainService: DomainService,
    private readonly roleService: RoleService,
  ) {
    super(userRepository);
  }

  addIsExexpired(user:UserGet) {
    var is_expired = false
    if (user.expire_time!=null) {
      var expire_time = new Date(user.expire_time)
      if (Date.now()>=expire_time.getTime()) {
        is_expired = true
      } else {
        is_expired = false
      }
    }
    user.is_expired = is_expired
  }

  async findAll(this_user:UserWithPermission, options=null, no_delete_password=false): Promise<User[]> {
    var users = await this.userRepository.find(options);
    if (!no_delete_password) {
      for (var user of users) {
        delete user.user_password
      }
    }
    for (var user of users) {
      this.addIsExexpired(user)
    }
    return users
  }

  async findAllInDomain(this_user:UserWithPermission, options=null): Promise<UserGet[]> {
    var users = await this.domainService.getAllUsers(this_user, this, this_user.domain_id, options?.where)
    return users
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<UserGet> {
    var user = await this.userRepository.findOne({
        where: {
          user_id:id,
        },
    });
    if (user!=null) delete user.user_password
    this.addIsExexpired(user)

    return user
  }

  async findOneInDomain(this_user:UserWithPermission, id: number): Promise<User> {
    var where:GetUserArgs = {user_id: id}
    var users = await this.domainService.getAllUsers(this_user, this, this_user.domain_id, where)
    return users.length>0 ? users[0] : null;
  }

  async checkUserPerm(this_role_id, role_id) {
    var this_user_perms = await this.roleService.getPermissionByRole(this_role_id)
    var user_perms = await this.roleService.getPermissionByRole(role_id)
    //Util.isSuperset(this_user_perms, user_perms)

    var this_user_perm_set:Set<string> = new Set(this_user_perms)
    for (var user_perm of user_perms) {
      if (!this_user_perm_set.has(user_perm)) {
        throw new HttpException(`Unable to specify higher permissions than yourself. [${user_perm}]`, HttpStatus.FORBIDDEN);
      }
    }
  }

  async create(this_user:UserWithPermission, user: UserUpdate): Promise<User> {
    if (user.user_account==null || (''+user.user_account).trim()=='') {
      throw new HttpException('user_account is invalid', HttpStatus.BAD_REQUEST);
    }
    if (user.domain_id==null) {
      throw new HttpException('domain_id is null', HttpStatus.BAD_REQUEST);
    }
    var in_domain = await this.domainService.includeDomain(this_user.domain_id, user.domain_id)
    if (!in_domain) {
      throw new HttpException('domain_id is out of domain', HttpStatus.FORBIDDEN);
    }
    if (user.role_id==null) {
      throw new HttpException(`role_id is invalid.`, HttpStatus.BAD_REQUEST);
    }
    await this.checkUserPerm(this_user.role_id, user.role_id)
    return await this.userRepository.save(user);
    //return await this.userRepository.insert(user);
  }

  async update(this_user:UserWithPermission, id: number, updateUser: UserUpdate): Promise<User> {
    var user:User = await this.findOneInDomain(this_user, id)
    if (user==null) {
      throw new HttpException('The user is not in this domain', HttpStatus.NOT_FOUND);
    }
    if (updateUser.domain_id!=null) {
      var in_domain = await this.domainService.includeDomain(this_user.domain_id, updateUser.domain_id)
      if (!in_domain) {
        throw new HttpException('domain_id is out of domain', HttpStatus.FORBIDDEN);
      }
    }
    if (updateUser.role_id!=null) {
      await this.checkUserPerm(this_user.role_id, updateUser.role_id)
    }
    await this.userRepository.update(id, updateUser);
    return await this.userRepository.findOne({
        where: {
          user_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    var user:User = await this.findOneInDomain(this_user, id)
    if (user==null) {
      throw new HttpException('The user is not in this domain', HttpStatus.NOT_FOUND);
    }
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }

}