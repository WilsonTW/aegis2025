import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode } from '@nestjs/common';
import { RepairTypeService } from './repair_type.service';
import { RepairType, RepairTypeUpdate } from './repair_type.entity';
import { RepairTypeControllerBase } from './repair_type.controller.base';

@Controller('api/repair_types')
export class RepairTypeController extends RepairTypeControllerBase {
  constructor(
    public readonly repairTypeService: RepairTypeService,
  ) {
    super(repairTypeService)
  }



}