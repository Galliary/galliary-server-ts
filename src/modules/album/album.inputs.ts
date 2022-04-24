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
}

@ArgsType()
@InputType()
export class UpdateAlbumInput implements Partial<CreateAlbumInput> {
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
}

@ArgsType()
@InputType()
export class UpdateAlbumInputInternal extends UpdateAlbumInput {
  @Field(() => String, { nullable: true })
  @Validate(ExtValidator)
  @IsOptional()
  coverExt?: string
}
