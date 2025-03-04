import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Device } from '../device/device.entity';
import { AuthLogin } from './auth.entity'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  //@UseGuards(LocalAuthGuard)
  @Mutation(returns => AuthLogin)
  async login(@Args('user_account') user_account: string, @Args('user_password') user_password: string): Promise<{ access_token: string }> {
    const user = { user_account, user_password }; // You should perform user validation here
    return this.authService.login(user_account, user_password);
  }

}
