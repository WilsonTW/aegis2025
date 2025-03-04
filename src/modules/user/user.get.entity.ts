import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';
import { User } from './user.entity';

@Entity({name: "user"})
@ObjectType({ description: 'User' })
export class UserGet extends User {
    @ApiProperty()
    @IsBoolean()
    @Column({"nullable":true})
    @Field({"nullable":true})
    is_expired?:boolean;
}
