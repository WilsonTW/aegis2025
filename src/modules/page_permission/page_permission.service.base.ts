import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PagePermission, PagePermissionUpdate } from './page_permission.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class PagePermissionServiceBase {
  constructor(
    @InjectRepository(PagePermission) public readonly pagePermissionRepository: Repository<PagePermission>,
  ) {}

  async create(this_user:UserWithPermission, pagePermission: PagePermissionUpdate): Promise<PagePermission> {
    return await this.pagePermissionRepository.save(pagePermission);
    //return await this.pagePermissionRepository.insert(pagePermission);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<PagePermission[]> {
    return await this.pagePermissionRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<PagePermission> {
    return await this.pagePermissionRepository.findOne({
        where: {
          page_permission_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updatePagePermission: PagePermissionUpdate): Promise<PagePermission> {
    await this.pagePermissionRepository.update(id, updatePagePermission);
    return await this.pagePermissionRepository.findOne({
        where: {
          page_permission_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.pagePermissionRepository.delete(id);
    return result.affected > 0;
  }
}