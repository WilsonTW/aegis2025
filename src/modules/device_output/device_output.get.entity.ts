import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { DeviceOutput } from './device_output.entity';

@Entity({name: "device_output"})
@ObjectType({ description: 'DeviceOutput' })
export class DeviceOutputGet extends DeviceOutput {
}
