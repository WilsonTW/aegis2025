import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, HttpCode, UseGuards, Query, Res, RawBodyRequest, Req, HttpException, HttpStatus, All, Next } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { DomainService } from '../domain/domain.service';
import { DeviceService } from '../device/device.service';
import { Request, Response } from 'express';
import * as rawbody from 'raw-body';
import { AppConfigService } from 'src/app_config.service';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { UserService } from '../user/user.service';

const onProxyReq = function (proxyReq, req, res) {
  // add new header to request
  const url = new URL(req.query.url as string);
  proxyReq.setHeader('host', url.host);
  proxyReq.setHeader('origin', url.origin);
};

const proxy = createProxyMiddleware({
  target: 'http://192.168.200.25:5000/voice_decode',
  /*
  router: (req) => {
    return req.query.url as string;
  },
  on: { proxyReq: onProxyReq },
  */
  ignorePath: true,
  changeOrigin: true,
});

@Controller('api/ai')
export class AIQueryController {
  constructor(
    public readonly userService: UserService,
    public readonly domainService: DomainService,
    public readonly deviceService: DeviceService,
  ) {}

  //@All()
  @Post('voice_query')
  get(@Req() req, @Res() res, @Next() next) {
    proxy(req, res, next);
  }


}