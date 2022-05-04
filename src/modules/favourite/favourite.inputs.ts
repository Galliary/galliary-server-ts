import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { MaxLength } from 'class-validator'

@ArgsType()
@InputType()
class SharedFavouriteInput {
  @Field(() => Boolean)
  unfavourite: boolean
}

@ArgsType()
@InputType()
export class FavouriteAlbumInput extends SharedFavouriteInput {
  @Field(() => String)
  @MaxLength(64)
  albumId: string
}

@ArgsType()
@InputType()
export class FavouriteImageInput extends SharedFavouriteInput {
  @Field(() => String)
  @MaxLength(64)
  imageId: string
}

@ArgsType()
@InputType()
export class FavouriteUserInput extends SharedFavouriteInput {
  @Field(() => String)
  @MaxLength(64)
  userId: string
}
