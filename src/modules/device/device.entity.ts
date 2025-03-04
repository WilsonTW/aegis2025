import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "device"})
@ObjectType({ description: 'Device' })
export class Device {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>Int, {})
  device_id:number;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":127})
  @Field(type=>String, {"nullable":false})
  device_name:string;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":127})
  @Field(type=>String, {"nullable":false})
  place_name:string;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":127})
  @Field(type=>String, {"nullable":false})
  device_alias_name:string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  device_type_id:number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  device_type_category_id:number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  device_connection_id:number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  domain_id:number;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":255})
  @Field(type=>String, {"nullable":false})
  address:string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column('decimal', {"nullable":true,"precision":10,"scale":8})
  @Field(type=>String, {"nullable":true})
  lat:string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column('decimal', {"nullable":true,"precision":11,"scale":8})
  @Field(type=>String, {"nullable":true})
  lng:string;

  @ApiProperty()
  @IsBoolean()
  @Column({"nullable":false})
  @Field({"nullable":false})
  is_online:boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('float', {"nullable":true})
  @Field(type=>Float, {"nullable":true})
  output_power_capacity:number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('float', {"nullable":true})
  @Field(type=>Float, {"nullable":true})
  bat_capacity:number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('float', {"nullable":true})
  @Field(type=>Float, {"nullable":true})
  solar_capacity:number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('float', {"nullable":true})
  @Field(type=>Float, {"nullable":true})
  solar_area:number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('float', {"nullable":true})
  @Field(type=>Float, {"nullable":true})
  solar_eff:number;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":31})
  @Field(type=>String, {"nullable":false})
  device_state:string;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":63})
  @Field(type=>String, {"nullable":false})
  error_code:string;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  error_description:string;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  last_data:string;

  @ApiProperty()
  @IsBoolean()
  @Column({"nullable":false})
  @Field({"nullable":false})
  enabled:boolean;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  external_devices:string;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  extra:string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @Column('timestamp', {"nullable":true})
  @Field(type=>Date, {"nullable":true})
  install_time:string;

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
  last_connect_time:string;


  
}

export class DeviceUpdate extends PartialType(OmitType(Device,  ['device_id'])) {
}
