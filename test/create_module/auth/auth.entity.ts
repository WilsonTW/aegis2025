import { IsNotEmpty, IsNumber, IsBoolean, IsDate, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Field, ObjectType, ID, Int } from '@nestjs/graphql';

@ObjectType({ description: 'AuthLogin' })
export class AuthLogin {
  @ApiProperty()
  @IsString()
  @Field({"nullable":false,"defaultValue":""})
  access_token:string;
}

