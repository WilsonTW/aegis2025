import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { DomainService } from './domain.service';
import { Domain, DomainUpdate } from './domain.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/domains')
export class DomainControllerBase {
  constructor(public readonly domainService: DomainService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() domain: DomainUpdate): Promise<Domain> {
    return this.domainService.create(req.user, domain);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The Domain records',
    type: Domain,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<Domain[]> {
    return this.domainService.findAll(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The Domain record',
    type: Domain,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<Domain> {
    var domain:Domain = await this.domainService.findOne(req.user, id);
    if (domain==null) {
      throw new HttpException('Domain not found', HttpStatus.NOT_FOUND);
    }
    return domain
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updateDomain: DomainUpdate): Promise<Domain> {
    return this.domainService.update(req.user, id, updateDomain);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.domainService.remove(req.user, id);
  }
}