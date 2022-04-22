import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AlbumModel } from 'models/album.model'
import { AlbumService } from 'modules/album/album.service'
import { CreateAlbumInput } from 'modules/album/album.inputs'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'modules/auth/strategies/jwt.guard'
import { CurrentUser } from 'decorators/current-user.decorator'
import { GetAlbumsArgs } from 'modules/album/album.args'
import { PermissionGuard } from 'guards/permission.guard'
import { WithPermissions } from 'decorators/with-permissions.decorator'
import { Permissions } from 'utils/permissions'
import { UserModel } from 'models/user.model'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { UploadService } from 'services/upload.service'

@Resolver(() => AlbumModel)
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AlbumResolver {
  constructor(
    private readonly service: AlbumService,
    private readonly uploads: UploadService,
  ) {}

  @Query(() => [AlbumModel])
  @WithPermissions(Permissions.VIEW_ALBUMS)
  albums(@Args() args: GetAlbumsArgs): Promise<AlbumModel[]> {
    return this.service.all(args)
  }

  @Mutation(() => AlbumModel)
  @WithPermissions(Permissions.UPLOAD_ALBUMS)
  async createAlbum(
    @CurrentUser() user,
    @Args() input: CreateAlbumInput,
    @Args({ name: 'coverImage', type: () => GraphQLUpload, nullable: true })
    coverImage?: FileUpload,
  ) {
    const album = await this.service.create(user, input)
    if (coverImage) {
      await this.uploads.uploadAlbumCover(album.id, user.id, coverImage)
    }
    return album
  }

  @Mutation(() => Boolean)
  @WithPermissions(Permissions.UPLOAD_ALBUMS)
  uploadAlbumCover(
    @CurrentUser() user: UserModel,
    @Args('albumId') albumId: string,
    @Args({ name: 'coverImage', type: () => GraphQLUpload, nullable: true })
    coverImage?: FileUpload,
  ) {
    return this.uploads.uploadAlbumCover(albumId, user.id, coverImage)
  }
}
