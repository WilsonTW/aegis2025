import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

//@Entity({name: "app"})
//@ObjectType({ description: 'App' })
export class PhoneNotifyDto {

  @ApiProperty({
    description: 'token',
    required: true
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'token',
    required: true
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'token',
    required: true
  })
  @IsString()
  body: string;
  
}
