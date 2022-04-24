import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'modules/auth/strategies/jwt.guard'
import { CurrentUser } from 'decorators/current-user.decorator'
import { PermissionGuard } from 'guards/permission.guard'
import { WithPermissions } from 'decorators/with-permissions.decorator'
import { Permissions } from 'utils/permissions'
import { ImageService } from 'modules/image/image.service'
import { ImageModel, ImageModelWithExtras } from 'models/image.model'
import { CreateImageInput, UpdateImageInput } from 'modules/image/image.inputs'
import { JwtUser } from 'modules/auth/strategies/jwt.strategy'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { GetImageArgs } from 'modules/image/image.args'
import { SearchDocument } from 'models/search-document.model'

@Resolver(() => ImageModel)
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ImageResolver {
  constructor(private readonly service: ImageService) {}

  @Query(() => ImageModelWithExtras, { nullable: true })
  @WithPermissions(Permissions.VIEW_ENTITIES)
  image(@Args('id') id: string): Promise<ImageModelWithExtras> {
    return this.service.get(id)
  }

  @Query(() => [ImageModelWithExtras])
  @WithPermissions(Permissions.VIEW_ENTITIES)
  images(@Args() args: GetImageArgs): Promise<ImageModelWithExtras[]> {
    return this.service.all(args)
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
  @WithPermissions(Permissions.UPDATE_OWNED_ENTITIES)
  updateImage(
    @CurrentUser() user: JwtUser,
    @Args('imageId') imageId: string,
    @Args('input') input: UpdateImageInput,
  ) {
    return this.service.update(user, imageId, input)
  }

  @Mutation(() => Boolean)
  @WithPermissions(Permissions.UPDATE_OWNED_ENTITIES)
  updateImageFile(
    @CurrentUser() user: JwtUser,
    @Args('imageId') imageId: string,
    @Args('imageFile', { type: () => GraphQLUpload }) imageFile: FileUpload,
  ): Promise<boolean> {
    return this.service.updateImageFile(user, imageId, imageFile)
  }
}
