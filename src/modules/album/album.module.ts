import { Module } from '@nestjs/common'
import { AlbumService } from 'modules/album/album.service'
import { AlbumResolver } from 'modules/album/album.resolver'
import { PrismaService } from 'services/prisma.service'
import { UploadService } from 'services/upload.service'

@Module({
  providers: [UploadService, PrismaService, AlbumResolver, AlbumService],
})
export class AlbumModule {}
