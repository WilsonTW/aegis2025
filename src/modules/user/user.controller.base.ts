import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserUpdate } from './user.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/users')
export class UserControllerBase {
  constructor(public readonly userService: UserService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() user: UserUpdate): Promise<User> {
    return this.userService.create(req.user, user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The User records',
    type: User,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<User[]> {
    return this.userService.findAll(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The User record',
    type: User,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<User> {
    var user:User = await this.userService.findOne(req.user, id);
    if (user==null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updateUser: UserUpdate): Promise<User> {
    return this.userService.update(req.user, id, updateUser);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.userService.remove(req.user, id);
  }
}