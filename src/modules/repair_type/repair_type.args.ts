import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ArgsType, Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { FindOperator } from 'typeorm';

@ArgsType()
export class GetRepairTypeArgs {
  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  repair_type_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  repair_type_name?:string|FindOperator<any>;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_type_id?:number;


  
}
