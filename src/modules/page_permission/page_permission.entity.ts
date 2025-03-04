import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "page_permission"})
@ObjectType({ description: 'PagePermission' })
export class PagePermission {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>Int, {})
  page_permission_id:number;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":64})
  @Field(type=>String, {"nullable":false})
  page_name:string;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  permissions:string;


  
}

export class PagePermissionUpdate extends PartialType(OmitType(PagePermission,  ['page_permission_id'])) {
}
