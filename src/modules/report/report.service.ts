import { Injectable } from '@nestjs/common'
import { PrismaService } from 'services/prisma.service'
import { JwtUser } from 'modules/auth/strategies/jwt.strategy'
import {
  ReportAlbumInput,
  ReportImageInput,
  ReportUserInput,
} from 'modules/report/report.inputs'
import { snowflake } from 'utils/snowflake'
import { omit } from 'lodash'
import { UserInputError } from 'apollo-server-express'
import { ReportErrorIds } from 'errors'
import { AlbumService } from 'modules/album/album.service'
import { ImageService } from 'modules/image/image.service'
import { UserService } from 'modules/user/user.service'
import { passValue } from 'utils/handlers'

@Injectable()
export class ReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly albums: AlbumService,
    private readonly images: ImageService,
    private readonly users: UserService,
  ) {}

  get(id: string) {
    return this.prisma.report.findUnique({ where: { id } })
  }

  all() {
    return this.prisma.report.findMany()
  }

  async create(
    author: JwtUser,
    input: ReportAlbumInput | ReportImageInput | ReportUserInput,
  ) {
    const existingReport = await this.prisma.report.findFirst({
      where: {
        reporteeId: author.id,
        ...omit(input, ['reason']),
      },
    })

    if (existingReport) {
      throw new UserInputError(ReportErrorIds.ReportAlreadyMade)
    }

    if (
      'albumId' in input &&
      (await this.albums.get(input.albumId).catch(passValue(null))) === null
    ) {
      throw new UserInputError(ReportErrorIds.AlbumDoesNotExist)
    }

    if (
      'imageId' in input &&
      (await this.images.get(input.imageId).catch(passValue(null))) === null
    ) {
      throw new UserInputError(ReportErrorIds.ImageDoesNotExist)
    }

    if (
      'userId' in input &&
      (await this.users.get(input.userId).catch(passValue(null))) === null
    ) {
      throw new UserInputError(ReportErrorIds.UserDoesNotExist)
    }

    await this.prisma.report.create({
      data: {
        ...input,
        id: snowflake(),
        reporteeId: author.id,
        createdAt: new Date(),
      },
    })

    return true
  }
}
