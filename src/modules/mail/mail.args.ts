import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ArgsType, Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { FindOperator } from 'typeorm';

@ArgsType()
export class GetMailArgs {
  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  mail_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  mail_type?:string|FindOperator<any>;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  user_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  content?:string|FindOperator<any>;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  readed?:boolean;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  repair_order_id?:number;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  device_id?:number;

  @IsDateString()
  @IsOptional()
  @Field(type=>Date, { nullable: true })
  create_time?:string|FindOperator<any>;


  
}
