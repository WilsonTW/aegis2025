import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "domain"})
@ObjectType({ description: 'Domain' })
export class Domain {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>Int, {})
  domain_id:number;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":64})
  @Field(type=>String, {"nullable":false})
  domain_name:string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  parent_domain_id:number;

  @ApiProperty()
  @IsBoolean()
  @Column({"nullable":false})
  @Field({"nullable":false})
  is_organization:boolean;

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
  @IsNumber()
  @IsOptional()
  @Column('float', {"nullable":true})
  @Field(type=>Float, {"nullable":true})
  zoom:number;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  photos:string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column('text', {"nullable":true})
  @Field(type=>String, {"nullable":true})
  feed_in_tariffs:string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('float', {"nullable":true})
  @Field(type=>Float, {"nullable":true})
  feed_in_tariff_now:number;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  data_sources:string;


  
}

export class DomainUpdate extends PartialType(OmitType(Domain,  ['domain_id'])) {
}
