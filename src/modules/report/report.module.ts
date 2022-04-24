import { Module } from '@nestjs/common'
import { PrismaService } from 'services/prisma.service'
import { AuthModule } from 'modules/auth/auth.module'
import { UploadService } from 'services/upload.service'
import { ReportResolver } from 'modules/report/report.resolver'
import { ReportService } from 'modules/report/report.service'
import { UserService } from 'modules/user/user.service'
import { ImageService } from 'modules/image/image.service'
import { AlbumService } from 'modules/album/album.service'

@Module({
  imports: [AuthModule],
  providers: [
    UploadService,
    PrismaService,
    UserService,
    ImageService,
    AlbumService,
    ReportResolver,
    ReportService,
  ],
})
export class ReportModule {}
