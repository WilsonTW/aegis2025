import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "device_connection"})
@ObjectType({ description: 'DeviceConnection' })
export class DeviceConnection {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>Int, {})
  device_connection_id:number;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":127})
  @Field(type=>String, {"nullable":false})
  device_connection_name:string;

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
  organization_id:number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column('text', {"nullable":true})
  @Field(type=>String, {"nullable":true})
  url:string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column('varchar', {"nullable":true,"length":255})
  @Field(type=>String, {"nullable":true})
  host:string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  port:number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column('varchar', {"nullable":true,"length":127})
  @Field(type=>String, {"nullable":true})
  username:string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column('varchar', {"nullable":true,"length":127})
  @Field(type=>String, {"nullable":true})
  password:string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column('varchar', {"nullable":true,"length":255})
  @Field(type=>String, {"nullable":true})
  token:string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column('varchar', {"nullable":true,"length":127})
  @Field(type=>String, {"nullable":true})
  org:string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column('varchar', {"nullable":true,"length":63})
  @Field(type=>String, {"nullable":true})
  database_name:string;

  @ApiProperty()
  @IsBoolean()
  @Column({"nullable":false})
  @Field({"nullable":false})
  enabled:boolean;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  extra:string;


  
}

export class DeviceConnectionUpdate extends PartialType(OmitType(DeviceConnection,  ['device_connection_id'])) {
}
