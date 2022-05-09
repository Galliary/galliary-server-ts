import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard'
import { CurrentUser } from 'decorators/current-user.decorator'
import { PermissionGuard } from 'guards/permission.guard'
import { WithPermissions } from 'decorators/with-permissions.decorator'
import { Permissions } from 'utils/permissions'
import { ImageService } from 'modules/image/image.service'
import { ImageModel } from 'models/image.model'
import { CreateImageInput, UpdateImageInput } from 'modules/image/image.inputs'
import { JwtUser } from 'modules/auth/strategies/jwt.strategy'
import { GetImageArgs } from 'modules/image/image.args'
import { SearchDocument } from 'models/search-document.model'
import { UserModel } from 'models/user.model'
import { AlbumModel } from 'models/album.model'

@Resolver(() => ImageModel)
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ImageResolver {
  constructor(private readonly service: ImageService) {}

  @Query(() => ImageModel, { nullable: true })
  @WithPermissions(Permissions.VIEW_ENTITIES)
  image(@Args('id') id: string): Promise<ImageModel> {
    return this.service.get(id)
  }

  @Query(() => [ImageModel])
  @WithPermissions(Permissions.VIEW_ENTITIES)
  images(
    @Args() args: GetImageArgs,
    @CurrentUser() user: JwtUser,
  ): Promise<ImageModel[]> {
    return this.service.all(args, user)
  }

  @ResolveField(() => AlbumModel)
  @WithPermissions(Permissions.VIEW_ENTITIES)
  album(@Parent() image: ImageModel, @CurrentUser() user: JwtUser) {
    return this.service.getAlbum(image.albumId, user)
  }

  @ResolveField(() => UserModel)
  @WithPermissions(Permissions.VIEW_ENTITIES)
  author(@Parent() image: ImageModel) {
    return this.service.getAuthor(image.authorId)
  }

  @Query(() => [ImageModel])
  @WithPermissions(Permissions.VIEW_ENTITIES)
  imagesForAlbum(
    @CurrentUser() user: JwtUser,
    @Args('albumId') albumId: string,
    @Args('args') args: GetImageArgs,
  ): Promise<ImageModel[]> {
    return this.service.byAlbumId(albumId, user, args)
  }

  @Query(() => [SearchDocument])
  @WithPermissions(Permissions.VIEW_ENTITIES)
  searchImages(@Args('query') query: string): Promise<SearchDocument[]> {
    return this.service.search(query)
  }

  @Mutation(() => ImageModel)
  @WithPermissions(Permissions.CREATE_ENTITIES)
  createImage(
    @CurrentUser() user: JwtUser,
    @Args() input: CreateImageInput,
  ): Promise<ImageModel> {
    return this.service.create(user, input)
  }

  @Mutation(() => Boolean)
  @WithPermissions(Permissions.DELETE_OWNED_ENTITIES)
  deleteImage(
    @CurrentUser() user: JwtUser,
    @Args('imageId') imageId: string,
  ): Promise<boolean> {
    return this.service.delete(user, imageId)
  }

  @Mutation(() => ImageModel)
  @WithPermissions(Permissions.UPDATE_OWNED_ENTITIES)
  updateImage(
    @CurrentUser() user: JwtUser,
    @Args('imageId') imageId: string,
    @Args('input') input: UpdateImageInput,
  ) {
    return this.service.update(user, imageId, input)
  }
}
