import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { PagePermissionService } from './page_permission.service';
import { PagePermission, PagePermissionUpdate } from './page_permission.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/page_permissions')
export class PagePermissionControllerBase {
  constructor(public readonly pagePermissionService: PagePermissionService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() pagePermission: PagePermissionUpdate): Promise<PagePermission> {
    return this.pagePermissionService.create(req.user, pagePermission);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The PagePermission records',
    type: PagePermission,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<PagePermission[]> {
    return this.pagePermissionService.findAll(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The PagePermission record',
    type: PagePermission,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<PagePermission> {
    var pagePermission:PagePermission = await this.pagePermissionService.findOne(req.user, id);
    if (pagePermission==null) {
      throw new HttpException('PagePermission not found', HttpStatus.NOT_FOUND);
    }
    return pagePermission
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updatePagePermission: PagePermissionUpdate): Promise<PagePermission> {
    return this.pagePermissionService.update(req.user, id, updatePagePermission);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.pagePermissionService.remove(req.user, id);
  }
}