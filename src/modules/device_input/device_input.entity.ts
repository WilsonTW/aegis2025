import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "device_input"})
@ObjectType({ description: 'DeviceInput' })
export class DeviceInput {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>Int, {})
  device_input_id:number;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":127})
  @Field(type=>String, {"nullable":false})
  device_input_name:string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  device_type_id:number;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":63})
  @Field(type=>String, {"nullable":false})
  input_type:string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column('varchar', {"nullable":true,"length":63})
  @Field(type=>String, {"nullable":true})
  method:string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column('text', {"nullable":true})
  @Field(type=>String, {"nullable":true})
  path:string;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":31})
  @Field(type=>String, {"nullable":false})
  data_type:string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column('text', {"nullable":true})
  @Field(type=>String, {"nullable":true})
  query:string;

  @ApiProperty()
  @IsBoolean()
  @Column({"nullable":false})
  @Field({"nullable":false})
  autorun:boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  run_every_second:number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  run_order:number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  response_output_id:number;


  
}

export class DeviceInputUpdate extends PartialType(OmitType(DeviceInput,  ['device_input_id'])) {
}
