import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "user"})
@ObjectType({ description: 'User' })
export class User {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>Int, {})
  user_id:number;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":64})
  @Field(type=>String, {"nullable":false})
  user_account:string;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":64})
  @Field(type=>String, {"nullable":false})
  user_name:string;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":64})
  @Field(type=>String, {"nullable":false})
  user_password:string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  domain_id:number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Column('int', {"nullable":true})
  @Field(type=>Int, {"nullable":true})
  role_id:number;

  @ApiProperty()
  @IsBoolean()
  @Column({"nullable":false})
  @Field({"nullable":false})
  is_supplier:boolean;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":32})
  @Field(type=>String, {"nullable":false})
  phone:string;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":63})
  @Field(type=>String, {"nullable":false})
  email:string;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":127})
  @Field(type=>String, {"nullable":false})
  line_notify_token:string;

  @ApiProperty()
  @IsString()
  @Column('varchar', {"nullable":false,"length":64})
  @Field(type=>String, {"nullable":false})
  contact_name:string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @Column('timestamp', {"nullable":true})
  @Field(type=>Date, {"nullable":true})
  create_time:string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @Column('timestamp', {"nullable":true})
  @Field(type=>Date, {"nullable":true})
  expire_time:string;


  
}

export class UserUpdate extends PartialType(OmitType(User,  ['user_id'])) {
}
