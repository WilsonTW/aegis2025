import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "device_meter"})
@ObjectType({ description: 'DeviceMeter' })
export class DeviceMeter {
//--- @(entities) ---
  device_meter_id:number;
}

export class DeviceMeterUpdate extends PartialType(OmitType(DeviceMeter,  ['device_meter_id'])) {
}
