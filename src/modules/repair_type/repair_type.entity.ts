import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "repair_type"})
@ObjectType({ description: 'RepairType' })
export class RepairType {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>Int, {})
  repair_type_id:number;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":255})
  @Field(type=>String, {"nullable":false})
  repair_type_name:string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  device_type_id:number;


  
}

export class RepairTypeUpdate extends PartialType(OmitType(RepairType,  ['repair_type_id'])) {
}
