
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(user_account: string, user_password: string): Promise<Omit<User,'user_password'> | null> {
    const user = await this.userService.findByUserAccount(user_account);

    if (user && user.user_password === user_password) {
      const { user_password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user_account:string, user_password:string): Promise<{ access_token: string }> {

    var user = await this.validateUser(user_account, user_password);
    if (user==null) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    }

    const payload = { username: user.user_name, sub: user.user_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
