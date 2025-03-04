import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ArgsType, Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { FindOperator } from 'typeorm';

@ArgsType()
export class GetRoleArgs {
  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  role_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  role_name?:string|FindOperator<any>;

  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  domain_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  page_permission?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  user_permission?:string|FindOperator<any>;


  
}
