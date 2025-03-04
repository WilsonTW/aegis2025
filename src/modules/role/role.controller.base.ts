import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role, RoleUpdate } from './role.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/roles')
export class RoleControllerBase {
  constructor(public readonly roleService: RoleService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() role: RoleUpdate): Promise<Role> {
    return this.roleService.create(req.user, role);
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
    return this.roleService.findAll(req.user);
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
    var role:Role = await this.roleService.findOne(req.user, id);
    if (role==null) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    return role
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updateRole: RoleUpdate): Promise<Role> {
    return this.roleService.update(req.user, id, updateRole);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.roleService.remove(req.user, id);
  }
}