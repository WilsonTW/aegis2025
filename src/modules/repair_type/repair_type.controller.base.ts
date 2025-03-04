import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { RepairTypeService } from './repair_type.service';
import { RepairType, RepairTypeUpdate } from './repair_type.entity';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@Controller('api/repair_types')
export class RepairTypeControllerBase {
  constructor(public readonly repairTypeService: RepairTypeService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() repairType: RepairTypeUpdate): Promise<RepairType> {
    return this.repairTypeService.create(req.user, repairType);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The RepairType records',
    type: RepairType,
    isArray: true
  })
  @Get()
  findAll(@Request() req): Promise<RepairType[]> {
    return this.repairTypeService.findAll(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The RepairType record',
    type: RepairType,
    isArray: false
  })
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<RepairType> {
    var repairType:RepairType = await this.repairTypeService.findOne(req.user, id);
    if (repairType==null) {
      throw new HttpException('RepairType not found', HttpStatus.NOT_FOUND);
    }
    return repairType
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Request() req, @Param('id') id: number, @Body() updateRepairType: RepairTypeUpdate): Promise<RepairType> {
    return this.repairTypeService.update(req.user, id, updateRepairType);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    return this.repairTypeService.remove(req.user, id);
  }
}