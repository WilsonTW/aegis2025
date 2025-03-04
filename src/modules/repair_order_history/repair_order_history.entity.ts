import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "repair_order_history"})
@ObjectType({ description: 'RepairOrderHistory' })
export class RepairOrderHistory {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>Int, {})
  repair_order_history_id:number;

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
  repair_item_id:number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  repair_record_id:number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  user_id:number;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":64})
  @Field(type=>String, {"nullable":false})
  user_name:string;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":64})
  @Field(type=>String, {"nullable":false})
  table_name:string;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  difference:string;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  snapshot:string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @Column('timestamp', {"nullable":true})
  @Field(type=>Date, {"nullable":true})
  create_time:string;


  
}

export class RepairOrderHistoryUpdate extends PartialType(OmitType(RepairOrderHistory,  ['repair_order_history_id'])) {
}
