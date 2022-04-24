import { Field, ObjectType } from '@nestjs/graphql'
import { Report } from '@prisma/client'
import { AlbumModel } from 'models/album.model'
import { ImageModel } from 'models/image.model'
import { UserModel } from 'models/user.model'

@ObjectType('Report')
export class ReportModel implements Report {
  @Field(() => String)
  id: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => AlbumModel, { nullable: true })
  album?: AlbumModel

  @Field(() => String, { nullable: true })
  albumId: string | null

  @Field(() => ImageModel, { nullable: true })
  image?: ImageModel

  @Field(() => String, { nullable: true })
  imageId: string | null

  @Field(() => UserModel, { nullable: true })
  user?: UserModel

  @Field(() => String, { nullable: true })
  userId: string | null

  @Field(() => UserModel, { nullable: true })
  reportee?: UserModel

  @Field(() => String, { nullable: true })
  reporteeId: string | null

  @Field(() => UserModel, { nullable: true })
  assignee?: UserModel

  @Field(() => String, { nullable: true })
  assigneeId: string | null

  @Field(() => String)
  reason: string
}
