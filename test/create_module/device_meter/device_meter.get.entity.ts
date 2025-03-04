import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { DeviceMeter } from './device_meter.entity';

@Entity({name: "device_meter"})
@ObjectType({ description: 'DeviceMeter' })
export class DeviceMeterGet extends DeviceMeter {
}
