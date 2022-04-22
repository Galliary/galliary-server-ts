import { ArgsType, Field, InputType, Int } from '@nestjs/graphql'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator'
import { FileUpload, GraphQLUpload } from 'graphql-upload'

@ArgsType()
@InputType()
export class CreateImageInput {
  @Field(() => String, { nullable: true })
  @MaxLength(128)
  @MinLength(3)
  @IsOptional()
  title: string | null

  @Field(() => String, { nullable: true })
  @MaxLength(256)
  @MinLength(3)
  @IsOptional()
  description: string | null

  @Field(() => [Int])
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  colors: number[]

  @Field(() => String)
  @MaxLength(64)
  @MinLength(1)
  albumId: string

  @Field(() => GraphQLUpload, { nullable: true })
  imageFile: FileUpload
}
