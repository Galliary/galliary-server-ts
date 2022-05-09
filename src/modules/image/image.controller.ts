import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ImageService } from 'modules/image/image.service'
import { CurrentUser } from 'decorators/current-user.decorator'
import { JwtUser } from 'modules/auth/strategies/jwt.strategy'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard'
import { WithPermissions } from 'decorators/with-permissions.decorator'
import { Permissions } from 'utils/permissions'

@Controller('images')
@UseGuards(JwtAuthGuard)
export class ImageController {
  constructor(private readonly service: ImageService) {}

  @Post(':imageId/upload')
  @WithPermissions(Permissions.UPDATE_OWNED_ENTITIES)
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @CurrentUser() user: JwtUser,
    @Param('imageId') imageId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.updateImageFile(user, imageId, file)
  }
}
