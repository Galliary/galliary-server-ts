import { ArgsType, Field, InputType, Int } from '@nestjs/graphql'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsOptional,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator'
import { ExtValidator } from 'modules/album/album.validators'

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

  @Field(() => String, { nullable: true })
  @Validate(ExtValidator)
  @IsOptional()
  imageExt?: string
}

@ArgsType()
@InputType()
export class UpdateImageInput
  implements Partial<Omit<CreateImageInput, 'albumId'>>
{
  @Field(() => String, { nullable: true })
  @MaxLength(128)
  @MinLength(3)
  @IsOptional()
  title?: string | null

  @Field(() => String, { nullable: true })
  @MaxLength(256)
  @MinLength(3)
  @IsOptional()
  description?: string | null

  @Field(() => [Int], { nullable: true })
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @IsOptional()
  colors?: number[]

  @Field(() => String, { nullable: true })
  @Validate(ExtValidator)
  @IsOptional()
  imageExt?: string
}
