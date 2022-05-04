import { Injectable } from '@nestjs/common'
import { PrismaService } from 'services/prisma.service'
import { JwtUser } from 'modules/auth/strategies/jwt.strategy'
import { AlbumService } from 'modules/album/album.service'
import { ImageService } from 'modules/image/image.service'
import { UserService } from 'modules/user/user.service'
import {
  FavouriteAlbumInput,
  FavouriteImageInput,
  FavouriteUserInput,
} from 'modules/favourite/favourite.inputs'

@Injectable()
export class FavouriteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly albums: AlbumService,
    private readonly images: ImageService,
    private readonly users: UserService,
  ) {}

  favouriteAlbum(user: JwtUser, input: FavouriteAlbumInput) {
    return this.prisma.user
      .update({
        where: { id: user.id },
        data: {
          favouriteAlbums: input.unfavourite
            ? { disconnect: { id: input.albumId } }
            : { connect: { id: input.albumId } },
        },
      })
      .then(() => true)
  }

  favouriteImage(user: JwtUser, input: FavouriteImageInput) {
    return this.prisma.user
      .update({
        where: { id: user.id },
        data: {
          favouriteImages: input.unfavourite
            ? { disconnect: { id: input.imageId } }
            : { connect: { id: input.imageId } },
        },
      })
      .then(() => true)
  }

  favouriteUser(user: JwtUser, input: FavouriteUserInput) {
    return this.prisma.user
      .update({
        where: { id: user.id },
        data: {
          favouriteUsers: input.unfavourite
            ? { disconnect: { id: input.userId } }
            : { connect: { id: input.userId } },
        },
      })
      .then(() => true)
  }
}
