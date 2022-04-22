import { Module } from '@nestjs/common'
import { PrismaService } from 'services/prisma.service'
import { UserService } from 'modules/user/user.service'
import { UserResolver } from 'modules/user/user.resolver'
import { AuthModule } from 'modules/auth/auth.module'
import { AlbumService } from 'modules/album/album.service'
import { UploadService } from 'services/upload.service'

@Module({
  imports: [AuthModule],
  providers: [
    UploadService,
    PrismaService,
    AlbumService,
    UserResolver,
    UserService,
  ],
})
export class UserModule {}
