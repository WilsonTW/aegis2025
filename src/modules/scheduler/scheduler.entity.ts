import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "scheduler"})
@ObjectType({ description: 'Scheduler' })
export class Scheduler {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>Int, {})
  scheduler_id:number;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":127})
  @Field(type=>String, {"nullable":false})
  scheduler_name:string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  organization_id:number;

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
  device_input_id:number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  device_id:number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column('varchar', {"nullable":true,"length":63})
  @Field(type=>String, {"nullable":true})
  cron:string;


  
}

export class SchedulerUpdate extends PartialType(OmitType(Scheduler,  ['scheduler_id'])) {
}
