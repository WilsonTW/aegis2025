import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { RepairOrderHistory } from './repair_order_history.entity';

@Entity({name: "repair_order_history"})
@ObjectType({ description: 'RepairOrderHistory' })
export class RepairOrderHistoryGet extends RepairOrderHistory {
}
