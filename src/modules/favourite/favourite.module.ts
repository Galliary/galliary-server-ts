import { Module } from '@nestjs/common'
import { PrismaService } from 'services/prisma.service'
import { AuthModule } from 'modules/auth/auth.module'
import { UploadService } from 'services/upload.service'
import { UserService } from 'modules/user/user.service'
import { ImageService } from 'modules/image/image.service'
import { AlbumService } from 'modules/album/album.service'
import { TokenModule } from 'modules/token/token.module'
import { FavouriteResolver } from 'modules/favourite/favourite.resolver'
import { FavouriteService } from 'modules/favourite/favourite.service'

@Module({
  imports: [TokenModule, AuthModule],
  providers: [
    UploadService,
    PrismaService,
    UserService,
    ImageService,
    AlbumService,
    FavouriteResolver,
    FavouriteService,
  ],
})
export class FavouriteModule {}
