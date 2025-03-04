import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDate, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int } from '@nestjs/graphql';

@Entity({name: "user"})
@ObjectType({ description: 'User' })
export class User {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  @Field(type=>ID, {})
  user_id:number;

  @ApiProperty()
  @IsString()
  @Column({"nullable":false,"length":64})
  @Field({"nullable":false})
  user_account:string;

  @ApiProperty()
  @IsString()
  @Column({"nullable":false,"default":"","length":64})
  @Field({"nullable":false,"defaultValue":""})
  user_name:string;

  @ApiProperty()
  @IsString()
  @Column({"nullable":false,"default":"","length":64})
  @Field({"nullable":false,"defaultValue":""})
  user_password:string;

  @ApiProperty()
  @IsBoolean()
  @Column({"nullable":false,"default":"false"})
  @Field({"nullable":false,"defaultValue":"false"})
  is_supplier:boolean;

  @ApiProperty()
  @IsString()
  @Column({"nullable":false,"default":"","length":32})
  @Field({"nullable":false,"defaultValue":""})
  phone:string;

  @ApiProperty()
  @IsString()
  @Column({"nullable":false,"default":"","length":64})
  @Field({"nullable":false,"defaultValue":""})
  contact_name:string;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Column({"nullable":true})
  @Field({"nullable":true})
  create_time:Date;


  
}

export class UserUpdate extends PartialType(OmitType(User,  ['user_id'])) {
}
