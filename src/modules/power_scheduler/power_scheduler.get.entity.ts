import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { PowerScheduler } from './power_scheduler.entity';

@Entity({name: "power_scheduler"})
@ObjectType({ description: 'PowerScheduler' })
export class PowerSchedulerGet extends PowerScheduler {
}
