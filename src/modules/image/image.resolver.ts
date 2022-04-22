import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'modules/auth/strategies/jwt.guard'
import { CurrentUser } from 'decorators/current-user.decorator'
import { PermissionGuard } from 'guards/permission.guard'
import { WithPermissions } from 'decorators/with-permissions.decorator'
import { Permissions } from 'utils/permissions'
import { UploadService } from 'services/upload.service'
import { ImageService } from 'modules/image/image.service'
import { ImageModel } from 'models/image.model'
import { CreateImageInput } from 'modules/image/image.inputs'
import { GetImageArgs } from 'modules/image/image.args'
import { extension } from 'mime-types'
import { snowflake } from 'utils/snowflake'

@Resolver(() => ImageModel)
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ImageResolver {
  constructor(
    private readonly service: ImageService,
    private readonly uploads: UploadService,
  ) {}

  @Query(() => [ImageModel])
  @WithPermissions(Permissions.UPLOAD_IMAGES)
  images(@Args() args: GetImageArgs): Promise<ImageModel[]> {
    return this.service.all(args)
  }

  @Mutation(() => ImageModel)
  @WithPermissions(Permissions.UPLOAD_IMAGES)
  async createImage(
    @CurrentUser() user,
    @Args() { imageFile, ...input }: CreateImageInput,
  ) {
    const image = await imageFile

    const imageId = snowflake()
    const imageExt = extension(image.mimetype) || undefined

    const imageData = await this.service.create(imageId, user, input, imageExt)

    await this.uploads.uploadImageToAlbum(
      imageId,
      input.albumId,
      user.id,
      image,
    )

    return imageData
  }
}
