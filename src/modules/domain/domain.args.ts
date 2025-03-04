import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ArgsType, Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { FindOperator } from 'typeorm';

@ArgsType()
export class GetDomainArgs {
  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  domain_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  domain_name?:string|FindOperator<any>;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  parent_domain_id?:number;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  is_organization?:boolean;

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

  @IsNumber()
  @IsOptional()
  @Field(type=>Float, { nullable: true })
  zoom?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  photos?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  feed_in_tariffs?:string|FindOperator<any>;

  @IsNumber()
  @IsOptional()
  @Field(type=>Float, { nullable: true })
  feed_in_tariff_now?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  data_sources?:string|FindOperator<any>;


  
}
