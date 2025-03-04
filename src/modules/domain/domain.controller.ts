import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, UseInterceptors, UploadedFiles, HttpStatus, HttpException } from '@nestjs/common';
import { DomainService } from './domain.service';
import { Domain, DomainUpdate } from './domain.entity';
import { DomainControllerBase } from './domain.controller.base';
import { ApiBody, ApiConsumes, ApiParam, ApiQuery, OmitType, PartialType } from '@nestjs/swagger';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { DataStorerManager } from '../data_storer/mqtt.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadPipe } from '../../upload_pipe.pipe';
import { AppConfigService } from '../../app_config.service';
import { Util } from '../../util/util';

const path = require('node:path');
const fs = require('fs');

@Controller('api/domains')
//export class DomainController extends PartialType(OmitType(DomainControllerBase,  ['remove'])) {
//export class DomainController extends OmitType(DomainControllerBase,  ['remove']) {
  export class DomainController extends DomainControllerBase {
  constructor(
    public readonly domainService: DomainService,
  ) {
    super(domainService)
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
    return this.domainService.findAllInDomain(req.user);
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
    var domain:Domain = await this.domainService.findOneInDomain(req.user, id);
    if (domain==null) {
      throw new HttpException('Domain not found', HttpStatus.NOT_FOUND);
    }
    return domain
  }


  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    await this.domainService.update(req.user, id, {
      parent_domain_id: AppConfigService.RECYCLE_DOMAIN_ID
    })
    await DataStorerManager.updateAllConnection();
    return true;
    //return this.domainService.remove(id);
  }



  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post(':domain_id/upload_photo')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
      //  comment: { type: 'string' },
      //  outletId: { type: 'integer' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(AnyFilesInterceptor())
  async uploadMultipleFiles(
    @Request() req,
    @Param('domain_id') domain_id: number,
    @UploadedFiles(UploadPipe) files: Express.Multer.File
  ) {
    var domain = await this.domainService.findOne(req.user, domain_id)
    if (domain==null) {
      throw new HttpException('Domain not found', HttpStatus.NOT_FOUND);
    }

    var config = AppConfigService.getSystemConfig();

    var domains_path = path.join(config.upload_path, config.domain_dirname);
    if (!fs.existsSync(domains_path)) {
      await fs.promises.mkdir(domains_path)
    }

    var domain_upload_path = path.join(domains_path, String(domain_id));
    if (!fs.existsSync(domain_upload_path)) {
      await fs.promises.mkdir(domain_upload_path)
    }

    var domain_download_path = config.download_path + '/' + config.domain_dirname + '/' + domain_id;

    var results = await Util.saveFile(domain_upload_path, domain_download_path, files);
    return results;
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Put(':domain_id/replace_photo')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
      //  comment: { type: 'string' },
      //  outletId: { type: 'integer' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(AnyFilesInterceptor())
  async replaceMultipleFiles(
    @Request() req,
    @Param('domain_id') domain_id: number,
    @UploadedFiles(UploadPipe) files: Express.Multer.File
  ) {
    var domain = await this.domainService.findOne(req.user, domain_id)
    if (domain==null) {
      throw new HttpException('Domain not found', HttpStatus.NOT_FOUND);
    }

    var config = AppConfigService.getSystemConfig();

    var domains_path = path.join(config.upload_path, config.domain_dirname);
    if (!fs.existsSync(domains_path)) {
      await fs.promises.mkdir(domains_path)
    }

    var domain_upload_path = path.join(domains_path, String(domain_id));
    if (!fs.existsSync(domain_upload_path)) {
      await fs.promises.mkdir(domain_upload_path)
    }

    var dir_files = fs.readdirSync(domain_upload_path);
    for (var fname of dir_files) {
      var file_path = path.join(domain_upload_path, fname);
      fs.unlinkSync(file_path);
    }

    var domain_download_path = config.download_path + '/' + config.domain_dirname + '/' + domain_id;

    var results = await Util.saveFile(domain_upload_path, domain_download_path, files);
    return results;
  }

  
  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'domain_id', required:true, description:'ex: "3"' })
  @ApiParam({ name: 'filename', required:true, description:'ex: "9d8e47e2-2b02-49c7-b3d5-039827bf9ce9.webp"' })
  @Delete(':domain_id/photos/:filename')
  async removePhoto(
    @Request() req,
    @Param('domain_id') domain_id: number,
    @Param('filename') filename: string
  ): Promise<boolean> {

    if (filename.trim().length==0 || /[^a-zA-Z0-9\.\-]/.test(filename)) {
      throw new HttpException('"filename" is invalid. ex: "9d8e47e2-2b02-49c7-b3d5-039827bf9ce9.webp"', HttpStatus.BAD_REQUEST);
    }

    var domain = await this.domainService.findOne(req.user, domain_id)
    if (domain==null) {
      throw new HttpException('Domain not found', HttpStatus.NOT_FOUND);
    }

    var config = AppConfigService.getSystemConfig();

    var domains_path = path.join(config.upload_path, config.domain_dirname);
    var domain_path = path.join(domains_path, String(domain_id));
    var file_path = path.join(domain_path, filename);
    console.log('DELETE file_path:', file_path);
    if (fs.existsSync(file_path)) {
      fs.unlinkSync(file_path);
      return true;
    }
    return false;
  }

}