import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode } from '@nestjs/common';
import { RepairOrderHistoryService } from './repair_order_history.service';
import { RepairOrderHistory, RepairOrderHistoryUpdate } from './repair_order_history.entity';
import { RepairOrderHistoryControllerBase } from './repair_order_history.controller.base';

@Controller('api/repair_order_historys')
export class RepairOrderHistoryController extends RepairOrderHistoryControllerBase {
  constructor(
    public readonly repairOrderHistoryService: RepairOrderHistoryService,
  ) {
    super(repairOrderHistoryService)
  }



}