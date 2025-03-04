import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ArgsType, Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { FindOperator } from 'typeorm';

@ArgsType()
export class GetDeviceTypeArgs {
  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_type_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  device_type_name?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  device_type_alias_name?:string|FindOperator<any>;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_type_category_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  connection_params?:string|FindOperator<any>;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  is_energy_storage?:boolean;


  
}
