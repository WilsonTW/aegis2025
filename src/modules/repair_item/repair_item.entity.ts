import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "repair_item"})
@ObjectType({ description: 'RepairItem' })
export class RepairItem {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>Int, {})
  repair_item_id:number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  repair_order_id:number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  repair_type_id:number;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  description:string;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":31})
  @Field(type=>String, {"nullable":false})
  repair_item_state:string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  device_id:number;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @Column('date', {"nullable":true})
  @Field(type=>Date, {"nullable":true})
  expect_end_date:string;

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

export class RepairItemUpdate extends PartialType(OmitType(RepairItem,  ['repair_item_id'])) {
}
