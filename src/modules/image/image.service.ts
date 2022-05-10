import { Injectable } from '@nestjs/common'
import { PrismaService } from 'services/prisma.service'
import { Image, LockingStatus, SafetyRating, User } from '@prisma/client'
import { CreateImageInput, UpdateImageInput } from 'modules/image/image.inputs'
import { JwtUser } from 'modules/auth/strategies/jwt.strategy'
import { snowflake } from 'utils/snowflake'
import { Permissions } from 'utils/permissions'
import { UserInputError } from 'apollo-server-express'
import { AlbumErrorIds, ImageErrorIds, SimplePaginationArgs } from 'errors'
import { extension } from 'mime-types'
import { UploadService } from 'services/upload.service'
import { ImageModel } from 'models/image.model'
import { GetImageArgs } from 'modules/image/image.args'
import { InjectMeiliSearch } from 'nestjs-meilisearch'
import { Hits, MeiliSearch } from 'meilisearch'
import { SearchIndex } from 'utils/search'
import { UserModel } from 'models/user.model'
import { SearchDocument } from 'models/search-document.model'

@Injectable()
export class ImageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploads: UploadService,
    @InjectMeiliSearch()
    private readonly meili: MeiliSearch,
  ) {}

  static toIndexDocument(
    author: User | UserModel | JwtUser,
    data: Image | ImageModel,
  ): SearchDocument {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      authorId: data.authorId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      colors: data.colors,
    }
  }

  search(query: string): Promise<Hits<SearchDocument>> {
    return null
    // return this.meili
    //   .index(SearchIndex.Images)
    //   .search<SearchDocument>(query)
    //   .then((res) => res.hits)
    //   .then((res) =>
    //     res.map((item) => {
    //       return {
    //         ...item,
    //         createdAt: new Date(item.createdAt),
    //         updatedAt: new Date(item.updatedAt),
    //       }
    //     }),
    //   )
  }

  create(author: JwtUser, input: CreateImageInput) {
    const albumId = snowflake()

    return this.prisma.image
      .create({
        data: {
          ...input,
          id: albumId,
          authorId: author.id,
          imageExt: 'N_A',
          createdAt: new Date(),
          updatedAt: new Date(),
          rating: SafetyRating.UNKNOWN,
          lockStatus: LockingStatus.NONE,
        },
      })
      .then((data) => {
        // this.meili
        //   .index(SearchIndex.Images)
        //   .addDocuments([ImageService.toIndexDocument(author, data)])
        //   .catch(console.error)

        return data
      })
  }

  async update(author: JwtUser, imageId: string, input: UpdateImageInput) {
    const image = await this.get(imageId)

    if (
      image.authorId !== author.id &&
      !author.permissions.has(Permissions.MODERATE_ENTITIES)
    ) {
      throw new UserInputError(ImageErrorIds.NoPermissionToEdit)
    }

    return this.prisma.image
      .update({
        where: { id: imageId },
        data: {
          ...input,
          updatedAt: new Date(),
        },
      })
      .then((data) => {
        // this.meili
        //   .index(SearchIndex.Images)
        //   .updateDocuments([ImageService.toIndexDocument(author, data)])

        return data
      })
  }

  async updateImageFile(
    author: JwtUser,
    imageId: string,
    imageFile: Express.Multer.File,
  ) {
    const image = await this.get(imageId)
    if (!image) {
      throw new UserInputError(ImageErrorIds.NotFound)
    }

    if (
      image.authorId !== author.id &&
      !author.permissions.has(Permissions.MODERATE_ENTITIES)
    ) {
      throw new UserInputError(ImageErrorIds.NoPermissionToEdit)
    }

    await this.uploads.uploadImageToAlbum(
      image.id,
      image.albumId,
      author.id,
      imageFile,
    )

    const imageExt = extension(imageFile.mimetype) || undefined

    if (!imageExt) {
      throw new UserInputError(ImageErrorIds.InvalidMimeType)
    }

    return this.update(author, imageId, { imageExt })
  }

  getAlbum(albumId: string, user?: JwtUser) {
    return this.prisma.album.findUnique({
      where: {
        id: albumId,
      },
      include: {
        userFavourites: {
          where: {
            id: user?.id,
          },
        },
      },
    })
  }

  byAuthor(authorId: string, user?: JwtUser, args: SimplePaginationArgs = {}) {
    return this.prisma.image.findMany({
      where: {
        authorId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        userFavourites: {
          where: {
            id: user?.id,
          },
        },
      },
      ...args,
    })
  }

  async delete(author: JwtUser, imageId: string) {
    const image = await this.get(imageId)

    if (
      image.authorId !== author.id &&
      !author.permissions.has(Permissions.MODERATE_ENTITIES)
    ) {
      throw new UserInputError(AlbumErrorIds.NoPermissionToEdit)
    }

    return this.prisma.image
      .delete({
        where: {
          id: imageId,
        },
      })
      .then(() => true)
  }

  favouritedByUser(
    authorId: string,
    user?: JwtUser,
    args: SimplePaginationArgs = {},
  ) {
    return this.prisma.image.findMany({
      where: {
        userFavourites: {
          some: {
            id: authorId,
          },
        },
      },
      include: {
        userFavourites: {
          where: {
            id: user?.id,
          },
        },
      },
      ...args,
    })
  }

  get(id: string) {
    return this.prisma.image.findUnique({
      where: { id },
    })
  }

  all(args: GetImageArgs, user?: JwtUser) {
    return this.prisma.image.findMany({
      take: args.amount,
      skip: args.cursor * args.amount,
      orderBy: { createdAt: 'desc' },
      include: {
        userFavourites: {
          where: {
            id: user?.id,
          },
        },
      },
    })
  }

  getAuthor(authorId: string) {
    return this.prisma.user.findUnique({ where: { id: authorId } })
  }

  byAlbumId(
    albumId: string,
    user?: JwtUser,
    args: GetImageArgs = { amount: 10, cursor: 0 },
  ): Promise<ImageModel[]> {
    return this.prisma.image.findMany({
      where: {
        albumId,
      },
      take: args.amount,
      skip: args.cursor * args.amount,
      include: {
        userFavourites: {
          where: {
            id: user?.id,
          },
        },
      },
    })
  }
}
