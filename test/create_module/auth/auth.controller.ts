// src/auth/auth.controller.ts
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';

class LoginDto {
  @ApiProperty({ description: 'User account' })
  user_account: string;

  @ApiProperty({ description: 'Password' })
  user_password: string;
}

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //@UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: () => String }) // 使用 type: () => String 描述類型
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() body: LoginDto): Promise<{ access_token: string }> {
    const { user_account, user_password } = body;
    return this.authService.login(user_account, user_password);
  }
}
