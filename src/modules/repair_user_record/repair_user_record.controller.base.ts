import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { RepairUserRecordService } from './repair_user_record.service';
import { RepairUserRecord, RepairUserRecordUpdate } from './repair_user_record.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/repair_user_records')
export class RepairUserRecordControllerBase {
  constructor(public readonly repairUserRecordService: RepairUserRecordService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() repairUserRecord: RepairUserRecordUpdate): Promise<RepairUserRecord> {
    return this.repairUserRecordService.create(req.user, repairUserRecord);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The RepairUserRecord records',
    type: RepairUserRecord,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<RepairUserRecord[]> {
    return this.repairUserRecordService.findAll(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The RepairUserRecord record',
    type: RepairUserRecord,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<RepairUserRecord> {
    var repairUserRecord:RepairUserRecord = await this.repairUserRecordService.findOne(req.user, id);
    if (repairUserRecord==null) {
      throw new HttpException('RepairUserRecord not found', HttpStatus.NOT_FOUND);
    }
    return repairUserRecord
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updateRepairUserRecord: RepairUserRecordUpdate): Promise<RepairUserRecord> {
    return this.repairUserRecordService.update(req.user, id, updateRepairUserRecord);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.repairUserRecordService.remove(req.user, id);
  }
}