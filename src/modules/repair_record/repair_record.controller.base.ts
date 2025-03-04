import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { RepairRecordService } from './repair_record.service';
import { RepairRecord, RepairRecordUpdate } from './repair_record.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/repair_records')
export class RepairRecordControllerBase {
  constructor(public readonly repairRecordService: RepairRecordService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() repairRecord: RepairRecordUpdate): Promise<RepairRecord> {
    return this.repairRecordService.create(req.user, repairRecord);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The RepairRecord records',
    type: RepairRecord,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<RepairRecord[]> {
    return this.repairRecordService.findAll(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The RepairRecord record',
    type: RepairRecord,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<RepairRecord> {
    var repairRecord:RepairRecord = await this.repairRecordService.findOne(req.user, id);
    if (repairRecord==null) {
      throw new HttpException('RepairRecord not found', HttpStatus.NOT_FOUND);
    }
    return repairRecord
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updateRepairRecord: RepairRecordUpdate): Promise<RepairRecord> {
    return this.repairRecordService.update(req.user, id, updateRepairRecord);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.repairRecordService.remove(req.user, id);
  }
}