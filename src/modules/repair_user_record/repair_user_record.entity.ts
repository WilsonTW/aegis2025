import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "repair_user_record"})
@ObjectType({ description: 'RepairUserRecord' })
export class RepairUserRecord {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>Int, {})
  repair_user_record_id:number;

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


  
}

export class RepairUserRecordUpdate extends PartialType(OmitType(RepairUserRecord,  ['repair_user_record_id'])) {
}
