import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { RepairOrderService } from './repair_order.service';
import { RepairOrder, RepairOrderUpdate } from './repair_order.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/repair_orders')
export class RepairOrderControllerBase {
  constructor(public readonly repairOrderService: RepairOrderService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() repairOrder: RepairOrderUpdate): Promise<RepairOrder> {
    return this.repairOrderService.create(req.user, repairOrder);
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
    return this.repairOrderService.findAll(req.user);
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
    var repairOrder:RepairOrder = await this.repairOrderService.findOne(req.user, id);
    if (repairOrder==null) {
      throw new HttpException('RepairOrder not found', HttpStatus.NOT_FOUND);
    }
    return repairOrder
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updateRepairOrder: RepairOrderUpdate): Promise<RepairOrder> {
    return this.repairOrderService.update(req.user, id, updateRepairOrder);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.repairOrderService.remove(req.user, id);
  }
}