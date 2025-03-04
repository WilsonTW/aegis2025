import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ArgsType, Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { FindOperator } from 'typeorm';

@ArgsType()
export class GetPowerSchedulerArgs {
  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  power_scheduler_id?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  domain_id?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  timezone?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  crons?:string|FindOperator<any>;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  notify_user_id?:number;

  @IsDateString()
  @IsOptional()
  @Field(type=>Date, { nullable: true })
  update_time?:string|FindOperator<any>;

  @IsDateString()
  @IsOptional()
  @Field(type=>Date, { nullable: true })
  start_time?:string|FindOperator<any>;

  @IsDateString()
  @IsOptional()
  @Field(type=>Date, { nullable: true })
  stop_time?:string|FindOperator<any>;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  running?:boolean;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  info?:string|FindOperator<any>;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  enabled?:boolean;


  
}
