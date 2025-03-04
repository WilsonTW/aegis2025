import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UploadedFiles, UseInterceptors, HttpException, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { RepairOrderService } from './repair_order.service';
import { RepairOrder, RepairOrderUpdate } from './repair_order.entity';
import { RepairOrderControllerBase } from './repair_order.controller.base';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiBearerAuth, ApiParam, ApiOkResponse } from '@nestjs/swagger';
import { UploadPipe } from '../../upload_pipe.pipe';
import { DomainService } from '../domain/domain.service';
import { AppConfigService } from '../../app_config.service';

import * as sharp from 'sharp';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { Util } from 'src/util/util';
const path = require('node:path');
const fs = require('fs');


@Controller('api/repair_orders')
export class RepairOrderController extends RepairOrderControllerBase {
  constructor(
    public readonly repairOrderService: RepairOrderService,
    public readonly domainService: DomainService,
  ) {
    super(repairOrderService)
  }


  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The RepairOrder records',
    type: RepairOrder,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<RepairOrder[]> {
    return this.repairOrderService.findAllInDomain(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The RepairOrder record',
    type: RepairOrder,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<RepairOrder> {
    var repairOrder:RepairOrder = await this.repairOrderService.findOneInDomain(req.user, id);
    if (repairOrder==null) {
      throw new HttpException('RepairOrder not found', HttpStatus.NOT_FOUND);
    }
    return repairOrder
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post(':repair_order_id/upload_photo')
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
    @Param('repair_order_id') repair_order_id: number,
    @UploadedFiles(UploadPipe) files: Express.Multer.File
  ) {
    var repair_order = await this.repairOrderService.findOne(req.user, repair_order_id)
    if (repair_order==null) {
      throw new HttpException('RepairOrder not found', HttpStatus.NOT_FOUND);
    }

    var config = AppConfigService.getSystemConfig();

    var repair_orders_path = path.join(config.upload_path, config.repair_order_dirname);
    if (!fs.existsSync(repair_orders_path)) {
      await fs.promises.mkdir(repair_orders_path)
    }

    var repair_order_upload_path = path.join(repair_orders_path, String(repair_order_id));
    if (!fs.existsSync(repair_order_upload_path)) {
      await fs.promises.mkdir(repair_order_upload_path)
    }

    var repair_order_download_path = config.download_path + '/' + config.repair_order_dirname + '/' + repair_order_id;

    var results = await Util.saveFile(repair_order_upload_path, repair_order_download_path, files);
    return results;
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Put(':repair_order_id/replace_photo')
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
    @Param('repair_order_id') repair_order_id: number,
    @UploadedFiles(UploadPipe) files: Express.Multer.File
  ) {
    var repair_order = await this.repairOrderService.findOne(req.user, repair_order_id)
    if (repair_order==null) {
      throw new HttpException('RepairOrder not found', HttpStatus.NOT_FOUND);
    }

    var config = AppConfigService.getSystemConfig();

    var repair_orders_path = path.join(config.upload_path, config.repair_order_dirname);
    if (!fs.existsSync(repair_orders_path)) {
      await fs.promises.mkdir(repair_orders_path)
    }

    var repair_order_upload_path = path.join(repair_orders_path, String(repair_order_id));
    if (!fs.existsSync(repair_order_upload_path)) {
      await fs.promises.mkdir(repair_order_upload_path)
    }

    var dir_files = fs.readdirSync(repair_order_upload_path);
    for (var fname of dir_files) {
      var file_path = path.join(repair_order_upload_path, fname);
      fs.unlinkSync(file_path);
    }

    var repair_order_download_path = config.download_path + '/' + config.repair_order_dirname + '/' + repair_order_id;

    var results = await Util.saveFile(repair_order_upload_path, repair_order_download_path, files);
    return results;
  }

  
  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'repair_order_id', required:true, description:'ex: "3"' })
  @ApiParam({ name: 'filename', required:true, description:'ex: "9d8e47e2-2b02-49c7-b3d5-039827bf9ce9.webp"' })
  @Delete(':repair_order_id/photos/:filename')
  async removePhoto(
    @Request() req,
    @Param('repair_order_id') repair_order_id: number,
    @Param('filename') filename: string
  ): Promise<boolean> {

    if (filename.trim().length==0 || /[^a-zA-Z0-9\.\-]/.test(filename)) {
      throw new HttpException('"filename" is invalid. ex: "9d8e47e2-2b02-49c7-b3d5-039827bf9ce9.webp"', HttpStatus.BAD_REQUEST);
    }

    var repair_order = await this.repairOrderService.findOne(req.user, repair_order_id)
    if (repair_order==null) {
      throw new HttpException('RepairOrder not found', HttpStatus.NOT_FOUND);
    }

    var config = AppConfigService.getSystemConfig();

    var repair_orders_path = path.join(config.upload_path, config.repair_order_dirname);
    var repair_order_path = path.join(repair_orders_path, String(repair_order_id));
    var file_path = path.join(repair_order_path, filename);
    console.log('DELETE file_path:', file_path);
    if (fs.existsSync(file_path)) {
      fs.unlinkSync(file_path);
      return true;
    }
    return false;
  }
}