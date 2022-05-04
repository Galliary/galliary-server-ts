import { Module } from '@nestjs/common'
import { PrismaService } from 'services/prisma.service'
import { UserService } from 'modules/user/user.service'
import { UserResolver } from 'modules/user/user.resolver'
import { AuthModule } from 'modules/auth/auth.module'
import { AlbumService } from 'modules/album/album.service'
import { UploadService } from 'services/upload.service'
import { ImageService } from 'modules/image/image.service'
import { TokenModule } from 'modules/token/token.module'

@Module({
  imports: [TokenModule, AuthModule],
  providers: [
    UploadService,
    PrismaService,
    AlbumService,
    ImageService,
    UserResolver,
    UserService,
  ],
})
export class UserModule {}
