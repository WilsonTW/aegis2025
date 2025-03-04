import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { RepairOrderHistoryService } from './repair_order_history.service';
import { RepairOrderHistory, RepairOrderHistoryUpdate } from './repair_order_history.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/repair_order_historys')
export class RepairOrderHistoryControllerBase {
  constructor(public readonly repairOrderHistoryService: RepairOrderHistoryService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() repairOrderHistory: RepairOrderHistoryUpdate): Promise<RepairOrderHistory> {
    return this.repairOrderHistoryService.create(req.user, repairOrderHistory);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The RepairOrderHistory records',
    type: RepairOrderHistory,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<RepairOrderHistory[]> {
    return this.repairOrderHistoryService.findAll(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The RepairOrderHistory record',
    type: RepairOrderHistory,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<RepairOrderHistory> {
    var repairOrderHistory:RepairOrderHistory = await this.repairOrderHistoryService.findOne(req.user, id);
    if (repairOrderHistory==null) {
      throw new HttpException('RepairOrderHistory not found', HttpStatus.NOT_FOUND);
    }
    return repairOrderHistory
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updateRepairOrderHistory: RepairOrderHistoryUpdate): Promise<RepairOrderHistory> {
    return this.repairOrderHistoryService.update(req.user, id, updateRepairOrderHistory);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.repairOrderHistoryService.remove(req.user, id);
  }
}