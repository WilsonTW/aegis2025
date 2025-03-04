import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "event"})
@ObjectType({ description: 'Event' })
export class Event {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>Int, {})
  event_id:number;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":63})
  @Field(type=>String, {"nullable":false})
  event_name:string;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":63})
  @Field(type=>String, {"nullable":false})
  event_type:string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  domain_id:number;

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
  device_output_id:number;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":127})
  @Field(type=>String, {"nullable":false})
  device_name:string;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  compare_function:string;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  message:string;

  @ApiProperty()
  @IsNumber()
  @Column('int', {"nullable":false})
  @Field(type=>Int, {"nullable":false})
  not_trigger_second:number;

  @ApiProperty()
  @IsBoolean()
  @Column({"nullable":false})
  @Field({"nullable":false})
  trigger_onchange:boolean;

  @ApiProperty()
  @IsBoolean()
  @Column({"nullable":false})
  @Field({"nullable":false})
  enabled:boolean;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  notifys:string;


  
}

export class EventUpdate extends PartialType(OmitType(Event,  ['event_id'])) {
}
