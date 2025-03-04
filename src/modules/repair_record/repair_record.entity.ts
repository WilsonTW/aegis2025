import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "repair_record"})
@ObjectType({ description: 'RepairRecord' })
export class RepairRecord {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>Int, {})
  repair_record_id:number;

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
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  description:string;

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
  create_time:string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @Column('timestamp', {"nullable":true})
  @Field(type=>Date, {"nullable":true})
  update_time:string;


  
}

export class RepairRecordUpdate extends PartialType(OmitType(RepairRecord,  ['repair_record_id'])) {
}
