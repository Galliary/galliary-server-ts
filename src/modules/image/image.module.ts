import { Module } from '@nestjs/common'
import { PrismaService } from 'services/prisma.service'
import { UploadService } from 'services/upload.service'
import { ImageResolver } from 'modules/image/image.resolver'
import { ImageService } from 'modules/image/image.service'
import { ImageController } from 'modules/image/image.controller'

@Module({
  controllers: [ImageController],
  providers: [UploadService, PrismaService, ImageResolver, ImageService],
})
export class ImageModule {}
