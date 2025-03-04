import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode } from '@nestjs/common';
import { PagePermissionService } from './page_permission.service';
import { PagePermission, PagePermissionUpdate } from './page_permission.entity';
import { PagePermissionControllerBase } from './page_permission.controller.base';

@Controller('api/page_permissions')
export class PagePermissionController extends PagePermissionControllerBase {
  constructor(
    public readonly pagePermissionService: PagePermissionService,
  ) {
    super(pagePermissionService)
  }



}