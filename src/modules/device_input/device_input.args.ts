import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ArgsType, Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { FindOperator } from 'typeorm';

@ArgsType()
export class GetDeviceInputArgs {
  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_input_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  device_input_name?:string|FindOperator<any>;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_type_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  input_type?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  method?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  path?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  data_type?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  query?:string|FindOperator<any>;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  autorun?:boolean;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  run_every_second?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  run_order?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  response_output_id?:number;


  
}
