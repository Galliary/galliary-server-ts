import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Image, LockingStatus, SafetyRating } from '@prisma/client'
import { UserModel } from 'models/user.model'

@ObjectType('Image')
export class ImageModel implements Image {
  @Field(() => String)
  id: string

  @Field(() => String)
  albumId: string

  @Field(() => String)
  authorId: string

  @Field(() => UserModel, { nullable: true })
  author?: UserModel | null

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => [Int])
  colors: number[]

  @Field(() => String)
  imageExt: string

  @Field(() => LockingStatus)
  lockStatus: LockingStatus

  @Field(() => SafetyRating)
  rating: SafetyRating

  @Field(() => String, { nullable: true })
  description: string | null

  @Field(() => String, { nullable: true })
  groupId: string | null

  @Field(() => String, { nullable: true })
  title: string | null

  @Field(() => [String])
  userFavouriteIds: string[]

  @Field(() => [UserModel], { nullable: true })
  userFavourites?: UserModel[] | null
}
