import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserUpdate } from './user.entity';
import { UserControllerBase } from './user.controller.base';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { UserGet } from './user.get.entity';

@Controller('api/users')
export class UserController extends UserControllerBase {
  constructor(
    public readonly userService: UserService,
  ) {
    super(userService)
  }


  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The User records',
    type: UserGet,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<UserGet[]> {
    return this.userService.findAllInDomain(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The User record',
    type: UserGet,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<UserGet> {
    var user:UserGet = await this.userService.findOneInDomain(req.user, id);
    if (user==null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user
  }

  
}