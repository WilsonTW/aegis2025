import { Controller, Get, Post, Query, UseGuards, Request, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './modules/auth/local-auth.guard';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PhoneNotifyDto } from './app.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post("api/notify_phone")
  NotifyPhone(
    @Request() req,
    @Body() arg: PhoneNotifyDto,
  ): Promise<boolean> {
    return this.appService.notifyPhone(req.user, arg.token, arg.title, arg.body);
  }

}
