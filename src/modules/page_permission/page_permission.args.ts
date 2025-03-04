import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ArgsType, Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { FindOperator } from 'typeorm';

@ArgsType()
export class GetPagePermissionArgs {
  @IsNumber()
  @IsOptional()
  @Field(type=>Int, { nullable: true })
  page_permission_id?:number;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  page_name?:string|FindOperator<any>;

  @IsString()
  @IsOptional()
  @Field(type=>String, { nullable: true })
  permissions?:string|FindOperator<any>;


  
}
