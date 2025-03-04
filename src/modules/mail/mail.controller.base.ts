import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { MailService } from './mail.service';
import { Mail, MailUpdate } from './mail.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/mails')
export class MailControllerBase {
  constructor(public readonly mailService: MailService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() mail: MailUpdate): Promise<Mail> {
    return this.mailService.create(req.user, mail);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The Mail records',
    type: Mail,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<Mail[]> {
    return this.mailService.findAll(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The Mail record',
    type: Mail,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<Mail> {
    var mail:Mail = await this.mailService.findOne(req.user, id);
    if (mail==null) {
      throw new HttpException('Mail not found', HttpStatus.NOT_FOUND);
    }
    return mail
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updateMail: MailUpdate): Promise<Mail> {
    return this.mailService.update(req.user, id, updateMail);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.mailService.remove(req.user, id);
  }
}