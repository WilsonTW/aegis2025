import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, UseInterceptors, UploadedFiles, HttpStatus, HttpException } from '@nestjs/common';
import { RepairRecordService } from './repair_record.service';
import { RepairRecord, RepairRecordUpdate } from './repair_record.entity';
import { RepairRecordControllerBase } from './repair_record.controller.base';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadPipe } from 'src/upload_pipe.pipe';
import { AppConfigService } from 'src/app_config.service';
import { Util } from 'src/util/util';

const path = require('node:path');
const fs = require('fs');

@Controller('api/repair_records')
export class RepairRecordController extends RepairRecordControllerBase {
  constructor(
    public readonly repairRecordService: RepairRecordService,
  ) {
    super(repairRecordService)
  }


  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post(':repair_record_id/upload_photo')
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
    @Param('repair_record_id') repair_record_id: number,
    @UploadedFiles(UploadPipe) files: Express.Multer.File
  ) {
    var repair_record = await this.findOne(req, repair_record_id)
    if (repair_record==null) {
      throw new HttpException('RepairRecord not found', HttpStatus.NOT_FOUND);
    }

    var config = AppConfigService.getSystemConfig();

    var repair_records_path = path.join(config.upload_path, config.repair_record_dirname);
    if (!fs.existsSync(repair_records_path)) {
      await fs.promises.mkdir(repair_records_path)
    }

    var repair_record_upload_path = path.join(repair_records_path, String(repair_record_id));
    if (!fs.existsSync(repair_record_upload_path)) {
      await fs.promises.mkdir(repair_record_upload_path)
    }

    var repair_record_download_path = config.download_path + '/' + config.repair_record_dirname + '/' + repair_record_id;

    var results = await Util.saveFile(repair_record_upload_path, repair_record_download_path, files);
    return results;
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Put(':repair_record_id/replace_photo')
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
    @Param('repair_record_id') repair_record_id: number,
    @UploadedFiles(UploadPipe) files: Express.Multer.File
  ) {
    var repair_record = await this.findOne(req, repair_record_id)
    if (repair_record==null) {
      throw new HttpException('RepairRecord not found', HttpStatus.NOT_FOUND);
    }

    var config = AppConfigService.getSystemConfig();

    var repair_records_path = path.join(config.upload_path, config.repair_record_dirname);
    if (!fs.existsSync(repair_records_path)) {
      await fs.promises.mkdir(repair_records_path)
    }

    var repair_record_upload_path = path.join(repair_records_path, String(repair_record_id));
    if (!fs.existsSync(repair_record_upload_path)) {
      await fs.promises.mkdir(repair_record_upload_path)
    }

    var dir_files = fs.readdirSync(repair_record_upload_path);
    for (var fname of dir_files) {
      var file_path = path.join(repair_record_upload_path, fname);
      fs.unlinkSync(file_path);
    }

    var repair_record_download_path = config.download_path + '/' + config.repair_record_dirname + '/' + repair_record_id;

    var results = await Util.saveFile(repair_record_upload_path, repair_record_download_path, files);
    return results;
  }

  
  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'repair_record_id', required:true, description:'ex: "3"' })
  @ApiParam({ name: 'filename', required:true, description:'ex: "9d8e47e2-2b02-49c7-b3d5-039827bf9ce9.webp"' })
  @Delete(':repair_record_id/photos/:filename')
  async removePhoto(
    @Request() req,
    @Param('repair_record_id') repair_record_id: number,
    @Param('filename') filename: string
  ): Promise<boolean> {

    if (filename.trim().length==0 || /[^a-zA-Z0-9\.\-]/.test(filename)) {
      throw new HttpException('"filename" is invalid. ex: "9d8e47e2-2b02-49c7-b3d5-039827bf9ce9.webp"', HttpStatus.BAD_REQUEST);
    }

    var repair_record = await this.findOne(req, repair_record_id)
    if (repair_record==null) {
      throw new HttpException('RepairRecord not found', HttpStatus.NOT_FOUND);
    }
   
    var config = AppConfigService.getSystemConfig();

    var repair_records_path = path.join(config.upload_path, config.repair_record_dirname);
    var repair_record_path = path.join(repair_records_path, String(repair_record_id));
    var file_path = path.join(repair_record_path, filename);
    console.log('DELETE file_path:', file_path);
    if (fs.existsSync(file_path)) {
      fs.unlinkSync(file_path);
      return true;
    }
    return false;
  }


}