import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Role, RoleUpdate } from './role.entity';
import { RoleServiceBase } from './role.service.base';
import { AppConfigService } from 'src/app_config.service';
import { PagePermissionService } from '../page_permission/page_permission.service';
import { PagePermission } from '../page_permission/page_permission.entity';
import { Util } from 'src/util/util';
import { UserWithPermission } from '../user/user_with_permission.entity';
import { DomainService } from '../domain/domain.service';
import { GetRoleArgs } from './role.args';

@Injectable()
export class RoleService extends RoleServiceBase {
  constructor(
    @InjectRepository(Role) public readonly roleRepository: Repository<Role>,
    private readonly domainService: DomainService,
    private readonly pagePermissionService: PagePermissionService,
  ) {
    super(roleRepository);
  }


  async checkData(this_user:UserWithPermission, role: RoleUpdate, role_id=null) {
    if (role_id!=null) {
      var role2:Role = await this.findOneInDomain(this_user, role_id)
      if (role2==null) {
        throw new HttpException('The role is not in this domain', HttpStatus.FORBIDDEN);
      }
    }

    if (role?.role_name!=null) {
      if ((''+role.role_name).trim()=='') {
        throw new HttpException('role_name is null', HttpStatus.BAD_REQUEST);
      }
    }

    if (role.domain_id!=null) {
      //var organization_id = await this.domainService.getOrganizationId(this_user.domain_id)
      if (!this.domainService.includeDomain(this_user.domain_id, role.domain_id)) {
        throw new HttpException('domain_id is outside', HttpStatus.FORBIDDEN);
      }
    }
  }

  async findAllInDomain(this_user:UserWithPermission, options=null): Promise<Role[]> {
    var roles = await this.domainService.getAllRoles(this_user, this, this_user.domain_id, options?.where)
    return roles
    /*
    var organization_id = await this.domainService.getOrganizationId(this_user.domain_id)
    options ??= {}
    options.where ??= {}
    options.where.domain_id = organization_id
    if (this_user.domain_id != organization_id) {
      options.where.role_id = this_user.role_id
    }
    return await this.roleRepository.find(options);
    */
  }

  async findOneInDomain(this_user:UserWithPermission, id: number): Promise<Role> {
    var where:GetRoleArgs = {role_id: id}
    var roles = await this.domainService.getAllRoles(this_user, this, this_user.domain_id, where)
    return roles.length>0 ? roles[0] : null;
    /*
    var options2:FindManyOptions<Role> = {where:{role_id: id}}
    var roles:Role[] = await this.findAllInDomain(this_user, options2)
    return roles.length>0 ? roles[0] : null;
    */
  }

  async create(this_user:UserWithPermission, role: RoleUpdate): Promise<Role> {
    await this.checkData(this_user, role)
    return await this.roleRepository.save(role);
    //return await this.roleRepository.insert(role);
  }

  async update(this_user:UserWithPermission, id: number, updateRole: RoleUpdate): Promise<Role> {
    await this.checkData(this_user, updateRole, id)
    await this.roleRepository.update(id, updateRole);
    return await this.roleRepository.findOne({
        where: {
          role_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    await this.checkData(this_user, null, id)
    const result = await this.roleRepository.delete(id);
    return result.affected > 0;
  }

  async getPermissionByRole(role_id) {

    var system_user = AppConfigService.getSystemUser()

    var page_permissions = await this.pagePermissionService.findAll(system_user)
    var page_permissionexs:Array<PagePermission & {perm:any}> = []
    for (var page_permission of page_permissions) {
      try {
        let perm = JSON.parse(page_permission.permissions)
        page_permissionexs.push({...page_permission, perm})
      } catch (ex) {
        throw new HttpException(`"page_permissions[${page_permission.page_name}]" is invalid". `, HttpStatus.SERVICE_UNAVAILABLE);
      }
    }

    var role = await this.findOne(system_user, role_id)
    if (role==null) {
      throw new HttpException('"role_id" not found', HttpStatus.NOT_FOUND);
    }

    var user_perms:Set<string> = new Set()
    //user_perms.add("view:user")
    user_perms.add("view:device_type")
    user_perms.add("view:device_type_category")

    if (!(role.user_permission==null || (''+role.user_permission).trim()=='')) {
      try {
        var role_user_perms = JSON.parse(role.user_permission)
        if (!Array.isArray(role_user_perms)) {
          throw new HttpException('"role.user_permission" is not a "Array". ', HttpStatus.SERVICE_UNAVAILABLE);
        }
        for (var role_user_perm of role_user_perms) {
          user_perms.add(role_user_perm)
        }
      } catch (ex) {
        throw new HttpException('"role.user_permission" is invalid. ' + ex, HttpStatus.SERVICE_UNAVAILABLE);
      }
    }


    var role_page_perms = []
    if (!(role.page_permission==null || (''+role.page_permission).trim()=='')) {
      try {
        role_page_perms = JSON.parse(role.page_permission)
        if (!Array.isArray(role_page_perms)) {
          throw new HttpException('"role.page_permission" is not a "Array". ', HttpStatus.SERVICE_UNAVAILABLE);
        }
      } catch (ex) {
        throw new HttpException('"role.page_permission" is invalid. ' + ex, HttpStatus.SERVICE_UNAVAILABLE);
      }
    }

    /*
    var role_page_perms = [{"name":"OverView","permission":1},{"name":"DeviceStatus","permission":1},{"name":"StatusMonitor","permission":1},{"name":"SecurityMonitor","permission":1}]
    */

    for (var role_page_perm of role_page_perms) {
      var page_permissionex = page_permissionexs.find(x=>x.page_name==role_page_perm.name)
      if (page_permissionex!=null) {
        let crud_perms:Set<string> = new Set()
        if (role_page_perm.permission==0) {
          continue
        }
        if (role_page_perm.permission>=1) {
          crud_perms = Util.unionSet(crud_perms, page_permissionex.perm["read"] ?? [])
        } 
        if (role_page_perm.permission>=2) {
          crud_perms = Util.unionSet(crud_perms, page_permissionex.perm["edit"] ?? [])
        }
        if (role_page_perm.permission>=3) {
          crud_perms = Util.unionSet(crud_perms, page_permissionex.perm["manage"] ?? [])
        }
        if (role_page_perm.permission>=4) {
          crud_perms = Util.unionSet(crud_perms, page_permissionex.perm["complete"] ?? [])
        }
        for (var crud_perm of crud_perms) {
          user_perms.add(crud_perm)
        }
      }
    }
    return Array.from(user_perms)

  }


}