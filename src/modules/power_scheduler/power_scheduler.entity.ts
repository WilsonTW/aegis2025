import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "power_scheduler"})
@ObjectType({ description: 'PowerScheduler' })
export class PowerScheduler {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>Int, {})
  power_scheduler_id:number;

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
  device_id:number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column('varchar', {"nullable":true,"length":31})
  @Field(type=>String, {"nullable":true})
  timezone:string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column('text', {"nullable":true})
  @Field(type=>String, {"nullable":true})
  crons:string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  notify_user_id:number;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @Column('timestamp', {"nullable":true})
  @Field(type=>Date, {"nullable":true})
  update_time:string;

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
  stop_time:string;

  @ApiProperty()
  @IsBoolean()
  @Column({"nullable":false})
  @Field({"nullable":false})
  running:boolean;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  info:string;

  @ApiProperty()
  @IsBoolean()
  @Column({"nullable":false})
  @Field({"nullable":false})
  enabled:boolean;


  
}

export class PowerSchedulerUpdate extends PartialType(OmitType(PowerScheduler,  ['power_scheduler_id'])) {
}
