import { Injectable } from '@nestjs/common'
import { PrismaService } from 'services/prisma.service'
import { CreateAlbumInput } from 'modules/album/album.inputs'
import { LockingStatus, SafetyRating } from '@prisma/client'
import { snowflake } from 'utils/snowflake'
import { UserModel } from 'models/user.model'
import { GetAlbumsArgs } from 'modules/album/album.args'

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  create(user: UserModel, input: CreateAlbumInput) {
    return this.prisma.album.create({
      data: {
        ...input,
        id: snowflake(),
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        rating: SafetyRating.UNKNOWN,
        lockStatus: LockingStatus.NONE,
      },
    })
  }

  byAuthor(authorId: string) {
    return this.prisma.album.findMany({
      where: {
        authorId,
      },
    })
  }

  all(args: GetAlbumsArgs) {
    return this.prisma.album.findMany({
      take: args.amount,
      skip: args.cursor * args.amount,
    })
  }
}
