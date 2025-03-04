import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ArgsType, Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { FindOperator } from 'typeorm';

@ArgsType()
export class GetEventArgs {
  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  event_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  event_name?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  event_type?:string|FindOperator<any>;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  domain_id?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_type_id?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_output_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  device_name?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  compare_function?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  message?:string|FindOperator<any>;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  not_trigger_second?:number;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  trigger_onchange?:boolean;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  enabled?:boolean;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  notifys?:string|FindOperator<any>;


  
}
