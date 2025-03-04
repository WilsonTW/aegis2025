import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "role"})
@ObjectType({ description: 'Role' })
export class Role {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>Int, {})
  role_id:number;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":64})
  @Field(type=>String, {"nullable":false})
  role_name:string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  domain_id:number;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  page_permission:string;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  user_permission:string;


  
}

export class RoleUpdate extends PartialType(OmitType(Role,  ['role_id'])) {
}
