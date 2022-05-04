import { Injectable } from '@nestjs/common'
import { PrismaService } from 'services/prisma.service'
import {
  CreateAlbumInput,
  UpdateAlbumInputInternal,
} from 'modules/album/album.inputs'
import { Album, LockingStatus, SafetyRating, User } from '@prisma/client'
import { snowflake } from 'utils/snowflake'
import { GetAlbumsArgs } from 'modules/album/album.args'
import { extension } from 'mime-types'
import { UploadService } from 'services/upload.service'
import { FileUpload } from 'graphql-upload'
import { UserInputError } from 'apollo-server-express'
import { AlbumErrorIds } from 'errors'
import { JwtUser } from 'modules/auth/strategies/jwt.strategy'
import { Permissions } from 'utils/permissions'
import { AlbumModel, AlbumModelWithExtras } from 'models/album.model'
import { InjectMeiliSearch } from 'nestjs-meilisearch'
import { Hits, MeiliSearch, SearchResponse } from 'meilisearch'
import { SearchIndex } from 'utils/search'
import { UserModel } from 'models/user.model'
import { SearchDocument } from 'models/search-document.model'

@Injectable()
export class AlbumService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploads: UploadService,
    @InjectMeiliSearch()
    private readonly meili: MeiliSearch,
  ) {}

  static toIndexDocument(
    author: User | UserModel | JwtUser,
    data: Album | AlbumModel,
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
    return this.meili
      .index(SearchIndex.Albums)
      .search<SearchDocument>(query)
      .then((res) => res.hits)
      .then((res) =>
        res.map((item) => {
          return {
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }
        }),
      )
  }

  async create(author: JwtUser, input: CreateAlbumInput) {
    const albumId = snowflake()

    return this.prisma.album
      .create({
        data: {
          ...input,
          id: albumId,
          authorId: author.id,
          coverExt: 'N_A',
          createdAt: new Date(),
          updatedAt: new Date(),
          rating: SafetyRating.UNKNOWN,
          lockStatus: LockingStatus.NONE,
        },
      })
      .then((data) => {
        this.meili
          .index(SearchIndex.Albums)
          .addDocuments([AlbumService.toIndexDocument(author, data)])
          .catch(console.error)

        return data
      })
  }

  async update(
    author: JwtUser,
    albumId: string,
    input: UpdateAlbumInputInternal,
  ) {
    const album = await this.get(albumId)

    if (
      album.authorId !== author.id &&
      !author.permissions.has(Permissions.MODERATE_ENTITIES)
    ) {
      throw new UserInputError(AlbumErrorIds.NoPermissionToEdit)
    }

    return this.prisma.album
      .update({
        where: { id: albumId },
        data: {
          ...input,
          updatedAt: new Date(),
        },
      })
      .then((data) => {
        this.meili
          .index(SearchIndex.Albums)
          .updateDocuments([AlbumService.toIndexDocument(author, data)])

        return true
      })
  }

  async updateCover(author: JwtUser, albumId: string, coverImage: FileUpload) {
    const album = await this.get(albumId)
    if (!album) {
      throw new UserInputError(AlbumErrorIds.NotFound)
    }

    if (
      album.authorId !== author.id &&
      !author.permissions.has(Permissions.MODERATE_ENTITIES)
    ) {
      throw new UserInputError(AlbumErrorIds.NoPermissionToEdit)
    }

    await this.uploads.uploadAlbumCover(album.id, author.id, coverImage)

    const coverExt = extension(coverImage.mimetype) || undefined

    if (!coverExt) {
      throw new UserInputError(AlbumErrorIds.CoverInvalidMimeType)
    }

    await this.update(author, albumId, { coverExt })

    return true
  }

  byAuthor(authorId: string) {
    return this.prisma.album.findMany({
      where: {
        authorId,
      },
    })
  }

  get(id: string): Promise<AlbumModelWithExtras> {
    return this.prisma.album
      .findUnique({
        where: {
          id,
        },
      })
      .then((item) => ({
        ...item,
        coverUrl: UploadService.getUrlForAlbumCover(
          item.authorId,
          item.id,
          item.coverExt,
        ),
      }))
  }

  all(args: GetAlbumsArgs): Promise<AlbumModelWithExtras[]> {
    return this.prisma.album
      .findMany({
        take: args.amount,
        skip: args.cursor * args.amount,
      })
      .then((items) =>
        items.map((item) => ({
          ...item,
          coverUrl: UploadService.getUrlForAlbumCover(
            item.authorId,
            item.id,
            item.coverExt,
          ),
        })),
      )
  }
}
