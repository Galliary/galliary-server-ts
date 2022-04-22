import { Field, Int, ObjectType } from '@nestjs/graphql'
import { LockingStatus, PremiumFeature, User, UserBadge } from '@prisma/client'
import { AlbumModel } from 'models/album.model'

@ObjectType()
export class UserModel implements Omit<User, 'hashedPassword'> {
  @Field(() => String)
  id: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => String, { nullable: true })
  avatarSourceId: string | null

  @Field(() => String, { nullable: true })
  avatarUrl: string | null

  @Field(() => [UserBadge])
  badges: UserBadge[]

  @Field(() => String)
  bannerExt: string

  @Field(() => String, { nullable: true })
  bio: string | null

  @Field(() => String)
  email: string

  @Field(() => LockingStatus)
  lockStatus: LockingStatus

  @Field(() => String, { nullable: true })
  nickname: string | null

  @Field(() => Int)
  permissions: number

  @Field(() => [PremiumFeature])
  premiumFeatures: PremiumFeature[]

  @Field(() => [String])
  userFavouriteIds: string[]

  @Field(() => String)
  username: string

  @Field(() => [AlbumModel], { nullable: true })
  albums?: AlbumModel[]
}

@ObjectType()
export class UserWithPasswordModel extends UserModel implements User {
  @Field(() => String, { nullable: true })
  hashedPassword: string | null
}
