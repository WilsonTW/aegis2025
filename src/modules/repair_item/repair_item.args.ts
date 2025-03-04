import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ArgsType, Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { FindOperator } from 'typeorm';

@ArgsType()
export class GetRepairItemArgs {
  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  repair_item_id?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  repair_order_id?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  repair_type_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  description?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  repair_item_state?:string|FindOperator<any>;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_id?:number;

  @IsDateString()
  @IsOptional()
  @Field(type=>Date, { nullable: true })
  expect_end_date?:string|FindOperator<any>;

  @IsNumber()
  @IsOptional()
  @Field(type=>Float, { nullable: true })
  completeness?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  photos?:string|FindOperator<any>;

  @IsDateString()
  @IsOptional()
  @Field(type=>Date, { nullable: true })
  start_time?:string|FindOperator<any>;

  @IsDateString()
  @IsOptional()
  @Field(type=>Date, { nullable: true })
  end_time?:string|FindOperator<any>;

  @IsDateString()
  @IsOptional()
  @Field(type=>Date, { nullable: true })
  create_time?:string|FindOperator<any>;


  
}
