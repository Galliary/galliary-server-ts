import { Module } from '@nestjs/common'
import { PrismaService } from 'services/prisma.service'
import { UploadService } from 'services/upload.service'
import { ImageResolver } from 'modules/image/image.resolver'
import { ImageService } from 'modules/image/image.service'

@Module({
  providers: [UploadService, PrismaService, ImageResolver, ImageService],
})
export class ImageModule {}
