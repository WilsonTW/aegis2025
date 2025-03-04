import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { Mail, MailUpdate } from './mail.entity';
import { MailControllerBase } from './mail.controller.base';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiParam, OmitType } from '@nestjs/swagger';

@Controller('api/mails')
export class MailController extends MailControllerBase {
  constructor(
    public readonly mailService: MailService,
  ) {
    super(mailService)
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'ids', required:true, description:'id to delete. split with ",". ex: "12,34,56"' })
  @Delete('multi/:ids')
  removeMulti(@Param('ids') ids: string): Promise<boolean> {
    return this.mailService.removeMulti(ids);
  }

}