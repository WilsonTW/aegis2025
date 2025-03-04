import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode } from '@nestjs/common';
import { RepairUserRecordService } from './repair_user_record.service';
import { RepairUserRecord, RepairUserRecordUpdate } from './repair_user_record.entity';
import { RepairUserRecordControllerBase } from './repair_user_record.controller.base';

@Controller('api/repair_user_records')
export class RepairUserRecordController extends RepairUserRecordControllerBase {
  constructor(
    public readonly repairUserRecordService: RepairUserRecordService,
  ) {
    super(repairUserRecordService)
  }



}