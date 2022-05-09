import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { AlbumModel } from 'models/album.model'
import { AlbumService } from 'modules/album/album.service'
import { CreateAlbumInput, UpdateAlbumInput } from 'modules/album/album.inputs'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard'
import { CurrentUser } from 'decorators/current-user.decorator'
import { GetAlbumsArgs } from 'modules/album/album.args'
import { PermissionGuard } from 'guards/permission.guard'
import { WithPermissions } from 'decorators/with-permissions.decorator'
import { Permissions } from 'utils/permissions'
import { JwtUser } from 'modules/auth/strategies/jwt.strategy'
import { SearchDocument } from 'models/search-document.model'
import { UserModel } from 'models/user.model'
import { ImageModel } from 'models/image.model'

@Resolver(() => AlbumModel)
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AlbumResolver {
  constructor(private readonly service: AlbumService) {}

  @Query(() => AlbumModel, { nullable: true })
  @WithPermissions(Permissions.VIEW_ENTITIES)
  album(@Args('id') id: string): Promise<AlbumModel> {
    return this.service.get(id)
  }

  @Query(() => [AlbumModel])
  @WithPermissions(Permissions.VIEW_ENTITIES)
  albums(
    @CurrentUser() user: JwtUser,
    @Args() args: GetAlbumsArgs,
  ): Promise<AlbumModel[]> {
    return this.service.all(user, args)
  }

  @ResolveField(() => [ImageModel])
  @WithPermissions(Permissions.VIEW_ENTITIES)
  images(@Parent() album: AlbumModel) {
    return this.service.getImagesInAlbum(album.id)
  }

  @ResolveField(() => UserModel)
  @WithPermissions(Permissions.VIEW_ENTITIES)
  author(@Parent() album: AlbumModel) {
    return this.service.getAuthor(album.authorId)
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
  @WithPermissions(Permissions.DELETE_OWNED_ENTITIES)
  deleteAlbum(
    @CurrentUser() user: JwtUser,
    @Args('albumId') albumId: string,
  ): Promise<boolean> {
    return this.service.delete(user, albumId)
  }

  @Mutation(() => AlbumModel)
  @WithPermissions(Permissions.UPDATE_OWNED_ENTITIES)
  updateAlbum(
    @CurrentUser() user: JwtUser,
    @Args('albumId') albumId: string,
    @Args('input') input: UpdateAlbumInput,
  ): Promise<AlbumModel> {
    return this.service.update(user, albumId, input)
  }
}
