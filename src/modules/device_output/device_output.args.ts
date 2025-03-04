import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ArgsType, Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { FindOperator } from 'typeorm';

@ArgsType()
export class GetDeviceOutputArgs {
  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_output_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  device_output_name?:string|FindOperator<any>;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_type_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  output_type?:string|FindOperator<any>;

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
  device_state_field?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  device_error_code_field?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  device_error_description_field?:string|FindOperator<any>;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  is_store?:boolean;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  properties?:string|FindOperator<any>;


  
}
