import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Album, LockingStatus, SafetyRating } from '@prisma/client'

@ObjectType()
export class AlbumModel implements Album {
  @Field(() => String)
  id: string

  @Field(() => String)
  authorId: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => [Int])
  colors: number[]

  @Field(() => String)
  coverExt: string

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
}
