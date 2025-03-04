import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Domain, DomainUpdate } from './domain.entity';
import { DomainServiceBase } from './domain.service.base';
import { User } from '../user/user.entity';
import { Device } from '../device/device.entity';
import { UserService } from '../user/user.service';
import { RepairOrderService } from '../repair_order/repair_order.service';
import { DeviceService } from '../device/device.service';
import { RepairOrder } from '../repair_order/repair_order.entity';
import { ArgsType, Field } from '@nestjs/graphql';
import { GetDomainArgs } from './domain.args';
import { IsNumber, IsOptional } from 'class-validator';
import { GetDeviceArgs } from '../device/device.args';
import { GetUserArgs } from '../user/user.args';
import { GetRepairItemArgs } from '../repair_item/repair_item.args';
import { GetRepairOrderArgs } from '../repair_order/repair_order.args';
import { AppConfigService } from 'src/app_config.service';
import { Util } from 'src/util/util';
import { start } from 'repl';
import { time } from 'console';
import { DeviceDataService } from '../device_data/device_data.service';
import { InfluxdbClientService } from '../device_data/influxdb_client.service';
import { UserWithPermission } from '../user/user_with_permission.entity';
import { RoleService } from '../role/role.service';
import { GetRoleArgs } from '../role/role.args';
import { Role } from '../role/role.entity';

var cache_child_domains:Array<{
  domain_id?:number,
  domain_name?:string,
  child_domain_ids:Array<number>
}> = null;


var cache_domains:Array<{
  domain_id?:number,
  domain_name?:string,
  parent_domain_id?:number,
  is_organization?:boolean
}> = null;


/*
@ArgsType()
export class GetAllDomainArgs extends GetDomainArgs {
  @IsNumber()
  @IsOptional()
  @Field({ nullable: true, defaultValue:1000000 })
  max_deepth?:number;
}

@ArgsType()
export class GetAllDeviceArgs extends GetDeviceArgs {
  @IsNumber()
  @IsOptional()
  @Field({ nullable: true, defaultValue:1000000 })
  max_deepth?:number;
}

@ArgsType()
export class GetAllUserArgs extends GetUserArgs {
  @IsNumber()
  @IsOptional()
  @Field({ nullable: true, defaultValue:1000000 })
  max_deepth?:number;
}

@ArgsType()
export class GetAllRepairItemArgs extends GetRepairItemArgs {
  @IsNumber()
  @IsOptional()
  @Field({ nullable: true, defaultValue:1000000 })
  max_deepth?:number;
}
*/

@Injectable()
export class DomainService extends DomainServiceBase {
  constructor(
    @InjectRepository(Domain) public readonly domainRepository: Repository<Domain>,
    //private readonly domainService: DomainService,
    //public readonly userService: UserService,
    //@InjectRepository(User) public readonly userRepository: Repository<User>,
    //@Inject(forwardRef(() => UserService)) public readonly userService: UserService,
    //@Inject(forwardRef(() => RepairOrderService)) public readonly repairOrderService: RepairOrderService,
    //@Inject(UserService) public readonly userService: UserService,
    //@Inject(RepairOrderService) public readonly repairOrderService: RepairOrderService,
    //public readonly userService: UserService,
    //public readonly repairOrderService: RepairOrderService,
  ) {
    //console.log('userService', userService)
    super(domainRepository);
  }
  
  getPhotos(domain_id) {
    var config = AppConfigService.getSystemConfig();
    return Util.getPhotos(config.domain_dirname, domain_id);
  }

  async findAll(this_user:UserWithPermission, options=null, computeFeedInTariff=false, computePhotos=true): Promise<Domain[]> {
    var domains:any = await this.domainRepository.find(options);
    if (computePhotos) {
      for (var domain of domains) {
        domain.photos = (await this.getPhotos(domain.domain_id)).join('|');
        //if (computeFeedInTariff) 
        //domain.feed_in_tariff_now = await this.getFeedInTariff(domain.domain_id)
      }
    }
    return domains;
  }

  async findAllInDomain(this_user:UserWithPermission, options=null): Promise<Domain[]> {
    var domains = await this.getAllDomains(this_user, this, this_user.domain_id, options?.where)
    return domains
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<any> {
    var domain:any = await this.domainRepository.findOne({
        where: {
          domain_id:id,
        },
    });
    if (domain!=null) domain.photos = (await this.getPhotos(domain.domain_id)).join('|');
    return domain;
  }

  async findOneInDomain(this_user:UserWithPermission, id: number): Promise<Domain> {
    var where:GetDomainArgs = {domain_id: id}
    var domains = await this.getAllDomains(this_user, this, this_user.domain_id, where)
    return domains.length>0 ? domains[0] : null;
  }
  

  async checkData(this_user:UserWithPermission, domain: DomainUpdate, parent_domain_id) {
    if (parent_domain_id==1 && domain.domain_name!=null) {
      if (/[\~\!\@\#\$\%\^\&\(\)\[\]\{\}\'\"\`\:\;\.\,\+\-\*\/\\\|\= ]+/.test(domain.domain_name)) {
        throw new HttpException('domain_name is invalid', HttpStatus.BAD_REQUEST);
      }
    }
    if (domain.parent_domain_id!=null) {
      var in_domain = await this.includeDomain(this_user.domain_id, domain.parent_domain_id)
      if (!in_domain) {
        throw new HttpException('parent_domain_id is out of domain', HttpStatus.FORBIDDEN);
      }
    }
  }

  async create(this_user:UserWithPermission, domain: DomainUpdate): Promise<Domain> {
    if (domain.domain_name==null || (''+domain.domain_name).trim()=='') {
      throw new HttpException('domain_name is invalid', HttpStatus.BAD_REQUEST);
    }
    if (domain.parent_domain_id==null) {
      throw new HttpException('parent_domain_id is null', HttpStatus.BAD_REQUEST);
    }
    await this.checkData(this_user, domain, domain.parent_domain_id)
    var ret = await this.domainRepository.save(domain);
    await this.buildCacheDomains();
    Util.notifyDeviceChanged()
    return ret;
    //return await this.domainRepository.insert(domain);
  }

  async update(this_user:UserWithPermission, id: number, updateDomain: DomainUpdate): Promise<Domain> {
    var domain:Domain = await this.findOneInDomain(this_user, id)
    if (domain==null) {
      throw new HttpException('The domain is not in this domain', HttpStatus.NOT_FOUND);
    }
    if (updateDomain.parent_domain_id!=AppConfigService.RECYCLE_DOMAIN_ID) { // 2:recycle
      await this.checkData(this_user, updateDomain, updateDomain.parent_domain_id ?? domain.parent_domain_id)
    }
    await this.domainRepository.update(id, updateDomain);
    var ret = await this.domainRepository.findOne({
        where: {
          domain_id:id,
        },
    });
    await this.buildCacheDomains();
    Util.notifyDeviceChanged()
    return ret;
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    //const result = await this.domainRepository.delete(id);
    //return result.affected > 0;
    if (id==AppConfigService.ROOT_DOMAIN_ID || id==AppConfigService.RECYCLE_DOMAIN_ID) { //{1:root, 2:recycle}
      throw new HttpException('This domain is protected', HttpStatus.FORBIDDEN);
    }
    var domain:Domain = await this.findOneInDomain(this_user, id)
    if (domain==null) {
      throw new HttpException('The domain is not in this domain', HttpStatus.NOT_FOUND);
    }
    await this.domainRepository.update(id, {
      parent_domain_id: AppConfigService.RECYCLE_DOMAIN_ID
    });
    await this.buildCacheDomains();
    Util.notifyDeviceChanged()
    return true;
  }

  async getCacheDomains(): Promise<Array<{
    domain_id?:number,
    domain_name?:string,
    parent_domain_id?:number
  }>> {
    if (cache_domains==null) await this.buildCacheDomains();
    return cache_domains;
  }

  async buildCacheDomains(): Promise<void> {
    cache_child_domains = [];
    var root_id = 1;
    var root_name = 'root';
    var max_deepth = 1000000;
    var domain_stack = [];
    domain_stack.push({domain_id:root_id, domain_name:root_name, deepth:0});
    for (var n=0; n<1000000; n++) {
      if (domain_stack.length==0) break;
      var {domain_id:parent_id, domain_name:parent_name, deepth:deepth} = domain_stack.pop();
      if (deepth>=max_deepth) continue;
      var childs = await this.domainRepository.find({
          where: {
            parent_domain_id: parent_id
          },
      });
      cache_child_domains.push({
        domain_id: parent_id,
        domain_name: parent_name,
        child_domain_ids: childs.map(x=>x.domain_id)
      });
      for (var child of childs) {
        domain_stack.push({domain_id:child.domain_id, domain_name:child.domain_name, deepth:deepth+1})
      }
    }

    // ------------------
    cache_domains = [];
    var domains = await this.domainRepository.find();
    for (var domain of domains) {
      cache_domains.push({
        domain_id: domain.domain_id,
        domain_name: domain.domain_name,
        parent_domain_id: domain.parent_domain_id,
        is_organization: domain.is_organization
      });
    }
  }

  async getDomainName(id: number): Promise<String> {
    if (cache_child_domains==null) await this.buildCacheDomains();
    return cache_child_domains.find(x=>x.domain_id==id)?.domain_name;
  }

  async getChildIds(parent_domain_id) {
    if (cache_child_domains==null) await this.buildCacheDomains();
    var child_ids = cache_child_domains.find(x=>x.domain_id==parent_domain_id)?.child_domain_ids;
    return child_ids
  }

  async getDomainTree(id: number, max_deepth:number=0): Promise<any> {
    var root:any = await this.domainRepository.findOne({
        where: {
          domain_id: id,
        },
    });
    if (root==null) return root;
    root.photos = (await this.getPhotos(root.domain_id)).join('|');

    var domain_stack = [];
    domain_stack.push({domain:root, deepth:0});
    for (var n=0; n<1000000; n++) {
      if (domain_stack.length==0) break;
      var {domain:parent, deepth:deepth} = domain_stack.pop();
      if (deepth>=max_deepth) continue;
      var childs = await this.domainRepository.find({
          where: {
            parent_domain_id: parent.domain_id
          },
      });
      parent.child_domains = childs;
      var child:any;
      for (child of childs) {
        child.photos = (await this.getPhotos(child.domain_id)).join('|');
        domain_stack.push({domain:child, deepth:deepth+1})
      }
    }
    return root;
  }

  async includeDomain(parent_domain_id, descendants_domain_id) {
    if (cache_domains==null) await this.buildCacheDomains();
    var domain_id = descendants_domain_id;
    while (domain_id!=null) {
      var domain = cache_domains.find(x=>x.domain_id==domain_id)
      if (domain==null) break;
      if (domain.domain_id==parent_domain_id) return true;
      domain_id = domain.parent_domain_id;
    }
    return false;
  }
  
  async getOrganizationId(domain_id):Promise<number> {
    if (domain_id==1) return 1;
    if (cache_domains==null) await this.buildCacheDomains();
    var dom_id = domain_id
    while (dom_id!=null) {
      var domain = cache_domains.find(x=>x.domain_id==dom_id)
      if (domain==null) break;
      if (domain.is_organization) return domain.domain_id;
      dom_id = domain.parent_domain_id
    }
    return null;
  }


  async getAllDomains(this_user:UserWithPermission, domainService:DomainService, id: number, args:GetDomainArgs={}, max_deepth:number=1000000): Promise<Array<Domain>> {
    var perms = Util.getViewPermissionByTable('domain')
    if (!Util.hasPermission(this_user, perms)) {
      throw new HttpException('No permission to access Domain', HttpStatus.FORBIDDEN);
    }
    return await this.getAll(this_user, domainService, id, args, 'domain_id', max_deepth)
  }

  async getAllRoles(this_user:UserWithPermission, roleService:RoleService, id: number, args:GetRoleArgs={}, max_deepth:number=1000000): Promise<Array<Role>> {
    var perms = Util.getViewPermissionByTable('role')
    var args2 = Object.assign({}, args)
    if (!Util.hasPermission(this_user, perms)) {
      if (args2.role_id!=null) {
        if (args2.role_id != this_user.role_id) {
          throw new HttpException('No permission to access Role', HttpStatus.FORBIDDEN);
        }
      } else {
        args2.role_id = this_user.role_id
      }
    }
    var organization_id = await this.getOrganizationId(id)
    return await this.getAll(this_user, roleService, organization_id, args2, 'role_id', max_deepth)
  }

  async getAllUsers(this_user:UserWithPermission, userService:UserService, id: number, args:GetUserArgs={}, max_deepth:number=1000000): Promise<Array<User>> {
    var perms = Util.getViewPermissionByTable('user')
    var args2 = Object.assign({}, args)
    if (!Util.hasPermission(this_user, perms)) {
      if (args2.user_id!=null) {
        if (args2.user_id != this_user.user_id) {
          throw new HttpException('No permission to access User', HttpStatus.FORBIDDEN);
        }
      } else {
        args2.user_id = this_user.user_id
      }
    }
    return await this.getAll(this_user, userService, id, args2, 'user_id', max_deepth)
  }

  async getAllDevices(this_user:UserWithPermission, deviceService:DeviceService, id: number, args:GetDeviceArgs={}, max_deepth:number=1000000): Promise<Array<Device>> {
    var perms = Util.getViewPermissionByTable('device')
    if (!Util.hasPermission(this_user, perms)) {
      throw new HttpException('No permission to access Device', HttpStatus.FORBIDDEN);
    }
    return await this.getAll(this_user, deviceService, id, args, 'device_id', max_deepth)
  }
  
  async getAllRepairOrders(this_user:UserWithPermission, repairOrderService:RepairOrderService, id: number, args:GetRepairOrderArgs={}, max_deepth:number=1000000): Promise<Array<RepairOrder>> {
    var perms = Util.getViewPermissionByTable('repair_order')
    if (!Util.hasPermission(this_user, perms)) {
      throw new HttpException('No permission to access RepairOrder', HttpStatus.FORBIDDEN);
    }
    return await this.getAll(this_user, repairOrderService, id, args, 'repair_order_id', max_deepth)
  }

  
  async getAll(this_user:UserWithPermission, service:{findAll:Function}, domain_id: number, where:any={}, sort_field:string=null, max_deepth:number=1000000): Promise<Array<any>> {
    var all_resources = [];
    if (!this.includeDomain(this_user.domain_id, domain_id)) {
      return all_resources
    }
    var domain_stack = [];
    domain_stack.push({domain_id:domain_id, deepth:0});
    for (var n=0; n<1000000; n++) {
      if (domain_stack.length==0) break;
      var {domain_id:parent_domain_id, deepth:deepth} = domain_stack.pop();
      if (deepth>=max_deepth) continue;
      var resources = []
      if ('domain_id' in where) {
        if (where.domain_id==parent_domain_id) {
          resources = await service.findAll(this_user, {
            where: where
          });
        }
      } else {
        var where2 = Object.assign({}, where)
        where2.domain_id = parent_domain_id
        resources = await service.findAll(this_user, {
          where: where2
        });
      }
      for (var resource of resources) all_resources.push(resource);
      var child_ids = await this.getChildIds(parent_domain_id)
      if (child_ids!=null) {
        for (var child_id of child_ids) {
          domain_stack.push({domain_id:child_id, deepth:deepth+1})
        }
      }
    }
    if (sort_field!=null) {
      all_resources.sort(function(a,b) {
        if (a[sort_field]>b[sort_field]) return 1;
        if (a[sort_field]<b[sort_field]) return -1;
        return 0;
      })
    }
    return all_resources;
  }


}


