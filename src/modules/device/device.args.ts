import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ArgsType, Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { FindOperator } from 'typeorm';

@ArgsType()
export class GetDeviceArgs {
  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  device_name?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  place_name?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  device_alias_name?:string|FindOperator<any>;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_type_id?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_type_category_id?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_connection_id?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  domain_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  address?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  lat?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  lng?:string|FindOperator<any>;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  is_online?:boolean;

  @IsNumber()
  @IsOptional()
  @Field(type=>Float, { nullable: true })
  output_power_capacity?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Float, { nullable: true })
  bat_capacity?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Float, { nullable: true })
  solar_capacity?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Float, { nullable: true })
  solar_area?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Float, { nullable: true })
  solar_eff?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  device_state?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  error_code?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  error_description?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  last_data?:string|FindOperator<any>;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  enabled?:boolean;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  external_devices?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  extra?:string|FindOperator<any>;

  @IsDateString()
  @IsOptional()
  @Field(type=>Date, { nullable: true })
  install_time?:string|FindOperator<any>;

  @IsDateString()
  @IsOptional()
  @Field(type=>Date, { nullable: true })
  create_time?:string|FindOperator<any>;

  @IsDateString()
  @IsOptional()
  @Field(type=>Date, { nullable: true })
  last_connect_time?:string|FindOperator<any>;


  
}
