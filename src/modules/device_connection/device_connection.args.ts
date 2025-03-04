import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ArgsType, Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { FindOperator } from 'typeorm';

@ArgsType()
export class GetDeviceConnectionArgs {
  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_connection_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  device_connection_name?:string|FindOperator<any>;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_type_id?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  organization_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  url?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  host?:string|FindOperator<any>;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  port?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  username?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  password?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  token?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  org?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  database_name?:string|FindOperator<any>;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  enabled?:boolean;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  extra?:string|FindOperator<any>;


  
}
