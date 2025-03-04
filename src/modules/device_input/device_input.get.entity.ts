import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { DeviceInput } from './device_input.entity';

@Entity({name: "device_input"})
@ObjectType({ description: 'DeviceInput' })
export class DeviceInputGet extends DeviceInput {
}
