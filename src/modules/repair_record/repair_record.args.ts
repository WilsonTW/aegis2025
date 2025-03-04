import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ArgsType, Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { FindOperator } from 'typeorm';

@ArgsType()
export class GetRepairRecordArgs {
  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  repair_record_id?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  repair_order_id?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  repair_item_id?:number;

  @IsDateString()
  @IsOptional()
  @Field(type=>Date, { nullable: true })
  start_time?:string|FindOperator<any>;

  @IsDateString()
  @IsOptional()
  @Field(type=>Date, { nullable: true })
  end_time?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  description?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  photos?:string|FindOperator<any>;

  @IsDateString()
  @IsOptional()
  @Field(type=>Date, { nullable: true })
  create_time?:string|FindOperator<any>;

  @IsDateString()
  @IsOptional()
  @Field(type=>Date, { nullable: true })
  update_time?:string|FindOperator<any>;


  
}
