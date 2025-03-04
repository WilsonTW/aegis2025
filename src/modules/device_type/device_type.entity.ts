import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "device_type"})
@ObjectType({ description: 'DeviceType' })
export class DeviceType {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>Int, {})
  device_type_id:number;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":255})
  @Field(type=>String, {"nullable":false})
  device_type_name:string;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":255})
  @Field(type=>String, {"nullable":false})
  device_type_alias_name:string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  device_type_category_id:number;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  connection_params:string;

  @ApiProperty()
  @IsBoolean()
  @Column({"nullable":false})
  @Field({"nullable":false})
  is_energy_storage:boolean;


  
}

export class DeviceTypeUpdate extends PartialType(OmitType(DeviceType,  ['device_type_id'])) {
}
