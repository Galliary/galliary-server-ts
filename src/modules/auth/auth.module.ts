import { Module } from '@nestjs/common'
import { AuthService } from 'modules/auth/auth.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigItem, ConfigService } from 'services/config.service'
import { JwtStrategy } from 'modules/auth/strategies/jwt.strategy'
import { UserService } from 'modules/user/user.service'
import { PrismaService } from 'services/prisma.service'
import { AlbumService } from 'modules/album/album.service'
import { PassportModule } from '@nestjs/passport'
import { JWT_EXPIRY } from 'consts'
import { UploadService } from 'services/upload.service'

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
    JwtModule.register({
      secret: ConfigService.get(ConfigItem.Secret),
      signOptions: { expiresIn: JWT_EXPIRY },
    }),
  ],
  providers: [
    AuthService,
    UploadService,
    AlbumService,
    PrismaService,
    UserService,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
