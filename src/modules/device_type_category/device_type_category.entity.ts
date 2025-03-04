import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "device_type_category"})
@ObjectType({ description: 'DeviceTypeCategory' })
export class DeviceTypeCategory {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>Int, {})
  device_type_category_id:number;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":255})
  @Field(type=>String, {"nullable":false})
  device_type_category_name:string;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":255})
  @Field(type=>String, {"nullable":false})
  device_type_category_alias_name:string;


  
}

export class DeviceTypeCategoryUpdate extends PartialType(OmitType(DeviceTypeCategory,  ['device_type_category_id'])) {
}
