import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AlbumModel, AlbumModelWithExtras } from 'models/album.model'
import { AlbumService } from 'modules/album/album.service'
import { CreateAlbumInput, UpdateAlbumInput } from 'modules/album/album.inputs'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard'
import { CurrentUser } from 'decorators/current-user.decorator'
import { GetAlbumsArgs } from 'modules/album/album.args'
import { PermissionGuard } from 'guards/permission.guard'
import { WithPermissions } from 'decorators/with-permissions.decorator'
import { Permissions } from 'utils/permissions'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { JwtUser } from 'modules/auth/strategies/jwt.strategy'
import { SearchDocument } from 'models/search-document.model'

@Resolver(() => AlbumModel)
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AlbumResolver {
  constructor(private readonly service: AlbumService) {}

  @Query(() => AlbumModelWithExtras, { nullable: true })
  @WithPermissions(Permissions.VIEW_ENTITIES)
  album(@Args('id') id: string): Promise<AlbumModelWithExtras> {
    return this.service.get(id)
  }

  @Query(() => [AlbumModelWithExtras])
  @WithPermissions(Permissions.VIEW_ENTITIES)
  albums(@Args() args: GetAlbumsArgs): Promise<AlbumModelWithExtras[]> {
    return this.service.all(args)
  }

  @Query(() => [SearchDocument])
  @WithPermissions(Permissions.VIEW_ENTITIES)
  searchAlbums(@Args('query') query: string): Promise<SearchDocument[]> {
    return this.service.search(query)
  }

  @Mutation(() => AlbumModel)
  @WithPermissions(Permissions.CREATE_ENTITIES)
  createAlbum(
    @CurrentUser() user: JwtUser,
    @Args() input: CreateAlbumInput,
  ): Promise<AlbumModel> {
    return this.service.create(user, input)
  }

  @Mutation(() => Boolean)
  @WithPermissions(Permissions.UPDATE_OWNED_ENTITIES)
  updateAlbum(
    @CurrentUser() user: JwtUser,
    @Args('albumId') albumId: string,
    @Args('input') input: UpdateAlbumInput,
  ) {
    return this.service.update(user, albumId, input)
  }

  @Mutation(() => Boolean)
  @WithPermissions(Permissions.UPDATE_OWNED_ENTITIES)
  updateAlbumCover(
    @CurrentUser() user: JwtUser,
    @Args('albumId') albumId: string,
    @Args('coverImage', { type: () => GraphQLUpload }) coverImage: FileUpload,
  ): Promise<boolean> {
    return this.service.updateCover(user, albumId, coverImage)
  }
}
