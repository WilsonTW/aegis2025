import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@Entity({name: "setting"})
@ObjectType({ description: 'Setting' })
export class Setting {
  @ApiProperty()
  @IsString()
  @PrimaryColumn()
  @Field(type=>Int, {})
  setting_id:string;

  @ApiProperty()
  @IsString()
  @Column('text', {"nullable":false})
  @Field(type=>String, {"nullable":false})
  setting_value:string;


  
}

export class SettingUpdate extends PartialType(OmitType(Setting,  ['setting_id'])) {
}
