import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { DeviceTypeCategory } from './device_type_category.entity';

@Entity({name: "device_type_category"})
@ObjectType({ description: 'DeviceTypeCategory' })
export class DeviceTypeCategoryGet extends DeviceTypeCategory {
}
