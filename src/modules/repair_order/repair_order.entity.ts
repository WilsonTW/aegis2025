import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "repair_order"})
@ObjectType({ description: 'RepairOrder' })
export class RepairOrder {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>Int, {})
  repair_order_id:number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  domain_id:number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  creator_id:number;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":127})
  @Field(type=>String, {"nullable":false})
  title:string;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":63})
  @Field(type=>String, {"nullable":false})
  contact_name:string;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":31})
  @Field(type=>String, {"nullable":false})
  contact_phone:string;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":127})
  @Field(type=>String, {"nullable":false})
  contact_email:string;

  @ApiProperty()
  @IsNumber()
  @Column('int', {"nullable":false})
  @Field(type=>Int, {"nullable":false})
  priority:number;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  custom_description:string;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  repair_description:string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @Column('date', {"nullable":true})
  @Field(type=>Date, {"nullable":true})
  expect_end_date:string;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":31})
  @Field(type=>String, {"nullable":false})
  repair_order_state:string;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":31})
  @Field(type=>String, {"nullable":false})
  repair_order_type:string;

  @ApiProperty()
  @IsNumber()
  @Column('float', {"nullable":false})
  @Field(type=>Float, {"nullable":false})
  completeness:number;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  photos:string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  supplier_id:number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  assign_user_id:number;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @Column('timestamp', {"nullable":true})
  @Field(type=>Date, {"nullable":true})
  start_time:string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @Column('timestamp', {"nullable":true})
  @Field(type=>Date, {"nullable":true})
  end_time:string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @Column('timestamp', {"nullable":true})
  @Field(type=>Date, {"nullable":true})
  create_time:string;


  
}

export class RepairOrderUpdate extends PartialType(OmitType(RepairOrder,  ['repair_order_id'])) {
}
