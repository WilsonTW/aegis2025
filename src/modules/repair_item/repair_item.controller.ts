import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode } from '@nestjs/common';
import { RepairItemService } from './repair_item.service';
import { RepairItem, RepairItemUpdate } from './repair_item.entity';
import { RepairItemControllerBase } from './repair_item.controller.base';

@Controller('api/repair_items')
export class RepairItemController extends RepairItemControllerBase {
  constructor(
    public readonly repairItemService: RepairItemService,
  ) {
    super(repairItemService)
  }



}