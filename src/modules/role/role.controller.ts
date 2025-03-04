import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role, RoleUpdate } from './role.entity';
import { RoleControllerBase } from './role.controller.base';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

@Controller('api/roles')
export class RoleController extends RoleControllerBase {
  constructor(
    public readonly roleService: RoleService,
  ) {
    super(roleService)
  }


  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The Role records',
    type: Role,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<Role[]> {
    return this.roleService.findAllInDomain(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The Role record',
    type: Role,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<Role> {
    var role:Role = await this.roleService.findOneInDomain(req.user, id);
    if (role==null) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    return role
  }


}