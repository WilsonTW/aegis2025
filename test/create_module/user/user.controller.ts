import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserUpdate } from './user.entity';
import { UserControllerBase } from './user.controller.base';

@Controller('api/users')
export class UserController extends UserControllerBase {
  constructor(
    public readonly userService: UserService,
  ) {
    super(userService)
  }



}