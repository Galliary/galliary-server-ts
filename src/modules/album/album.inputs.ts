import { ArgsType, Field, InputType, Int } from '@nestjs/graphql'
import {
  IsOptional,
  MaxLength,
  MinLength,
  Validate,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator'
import { ExtValidator } from 'modules/album/album.validators'

@ArgsType()
@InputType()
export class CreateAlbumInput {
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
  @MaxLength(16)
  @MinLength(1)
  @Validate(ExtValidator)
  coverExt: string
}
