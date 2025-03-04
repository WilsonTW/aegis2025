import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { RepairUserRecord } from './repair_user_record.entity';

@Entity({name: "repair_user_record"})
@ObjectType({ description: 'RepairUserRecord' })
export class RepairUserRecordGet extends RepairUserRecord {
}
