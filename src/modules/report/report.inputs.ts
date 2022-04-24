import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { MaxLength, MinLength } from 'class-validator'

@ArgsType()
@InputType()
export class ReportAlbumInput {
  @Field(() => String)
  @MaxLength(64)
  albumId: string

  @Field(() => String)
  @MaxLength(512)
  @MinLength(16)
  reason: string
}

@ArgsType()
@InputType()
export class ReportImageInput {
  @Field(() => String)
  @MaxLength(64)
  imageId: string

  @Field(() => String)
  @MaxLength(512)
  @MinLength(16)
  reason: string
}

@ArgsType()
@InputType()
export class ReportUserInput {
  @Field(() => String)
  @MaxLength(64)
  userId: string

  @Field(() => String)
  @MaxLength(512)
  @MinLength(16)
  reason: string
}
