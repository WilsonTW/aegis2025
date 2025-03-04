import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ArgsType, Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { FindOperator } from 'typeorm';

@ArgsType()
export class GetSchedulerArgs {
  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  scheduler_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  scheduler_name?:string|FindOperator<any>;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  organization_id?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_type_id?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_input_id?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  cron?:string|FindOperator<any>;


  
}
