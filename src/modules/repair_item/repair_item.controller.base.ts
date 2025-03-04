import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { RepairItemService } from './repair_item.service';
import { RepairItem, RepairItemUpdate } from './repair_item.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/repair_items')
export class RepairItemControllerBase {
  constructor(public readonly repairItemService: RepairItemService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() repairItem: RepairItemUpdate): Promise<RepairItem> {
    return this.repairItemService.create(req.user, repairItem);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The RepairItem records',
    type: RepairItem,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<RepairItem[]> {
    return this.repairItemService.findAll(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The RepairItem record',
    type: RepairItem,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<RepairItem> {
    var repairItem:RepairItem = await this.repairItemService.findOne(req.user, id);
    if (repairItem==null) {
      throw new HttpException('RepairItem not found', HttpStatus.NOT_FOUND);
    }
    return repairItem
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updateRepairItem: RepairItemUpdate): Promise<RepairItem> {
    return this.repairItemService.update(req.user, id, updateRepairItem);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.repairItemService.remove(req.user, id);
  }
}