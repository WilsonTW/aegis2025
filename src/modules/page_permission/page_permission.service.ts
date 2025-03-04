import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PagePermission, PagePermissionUpdate } from './page_permission.entity';
import { PagePermissionServiceBase } from './page_permission.service.base';

@Injectable()
export class PagePermissionService extends PagePermissionServiceBase {
  constructor(
    @InjectRepository(PagePermission) public readonly pagePermissionRepository: Repository<PagePermission>,
  ) {
    super(pagePermissionRepository);
  }

  

}