import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, HttpStatus, HttpException } from '@nestjs/common';
import { DeviceTypeService } from './device_type.service';
import { DeviceType, DeviceTypeUpdate } from './device_type.entity';
import { DeviceTypeControllerBase } from './device_type.controller.base';


import { Entity, Column } from 'typeorm';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength, IsJSON } from 'class-validator';
import { ApiBearerAuth, ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { DeviceInputService } from '../device_input/device_input.service';
import { DeviceService } from '../device/device.service';
import { DomainService } from '../domain/domain.service';
import { Util } from '../../util/util';
import { DataStorerManager } from '../data_storer/mqtt.service';

@Entity({name: "device_type_trigger"})
@ObjectType({ description: 'DeviceTypeTrigger' })
export class DeviceTypeTriggerArg {

  @ApiProperty()
  @IsNumber()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  domain_id?:number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column('text', {"nullable":true})
  @Field(type=>String, {"nullable":true})
  device_name?:string;

  @ApiProperty()
  @IsNumber()
  @Column('int', {"nullable":false})
  @Field(type=>Int, {"nullable":false})
  device_input_id:number;

  @ApiProperty()
  @IsJSON()
  @IsOptional()
  @Column('json', {"nullable":true})
  @Field(type=>JSON, {"nullable":true})
  param?:any;
}

//export class DeviceTypeTriggerArgEx extends DeviceTypeTriggerArg {
//  device:any
//}

@Controller('api/device_types')
export class DeviceTypeController extends DeviceTypeControllerBase {
  constructor(
    public readonly deviceTypeService: DeviceTypeService,
  ) {
    super(deviceTypeService)
  }


}