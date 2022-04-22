import { Injectable } from '@nestjs/common'
import { PrismaService } from 'services/prisma.service'
import { LockingStatus, SafetyRating } from '@prisma/client'
import { UserModel } from 'models/user.model'
import { CreateImageInput } from 'modules/image/image.inputs'
import { GetImageArgs } from 'modules/image/image.args'

@Injectable()
export class ImageService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    id: string,
    user: UserModel,
    input: Omit<CreateImageInput, 'imageFile'>,
    imageExt?: string,
  ) {
    return this.prisma.image.create({
      data: {
        ...input,
        id,
        imageExt,
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        rating: SafetyRating.UNKNOWN,
        lockStatus: LockingStatus.NONE,
      },
    })
  }

  updateExtension(id: string, imageExt: string) {
    return this.prisma.image.update({
      where: {
        id,
      },
      data: {
        imageExt,
      },
    })
  }

  byAuthor(authorId: string) {
    return this.prisma.image.findMany({
      where: {
        authorId,
      },
    })
  }

  all(args: GetImageArgs) {
    return this.prisma.image.findMany({
      take: args.amount,
      skip: args.cursor * args.amount,
    })
  }
}
