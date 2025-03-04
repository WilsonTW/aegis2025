import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "mail"})
@ObjectType({ description: 'Mail' })
export class Mail {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>Int, {})
  mail_id:number;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":63})
  @Field(type=>String, {"nullable":false})
  mail_type:string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  user_id:number;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  content:string;

  @ApiProperty()
  @IsBoolean()
  @Column({"nullable":false})
  @Field({"nullable":false})
  readed:boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  repair_order_id:number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  device_id:number;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @Column('timestamp', {"nullable":true})
  @Field(type=>Date, {"nullable":true})
  create_time:string;


  
}

export class MailUpdate extends PartialType(OmitType(Mail,  ['mail_id'])) {
}
