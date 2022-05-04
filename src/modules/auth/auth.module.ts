import { Module } from '@nestjs/common'
import { AuthService } from 'modules/auth/auth.service'
import { UserService } from 'modules/user/user.service'
import { PrismaService } from 'services/prisma.service'
import { AlbumService } from 'modules/album/album.service'
import { PassportModule } from '@nestjs/passport'
import { UploadService } from 'services/upload.service'
import { AuthController } from 'modules/auth/auth.controller'
import { DiscordOAuthStrategy } from 'modules/auth/strategies/discord.o-auth.strategy'
import { TokenModule } from 'modules/token/token.module'

@Module({
  imports: [
    TokenModule,
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    UploadService,
    AlbumService,
    PrismaService,
    UserService,
    AuthService,
    DiscordOAuthStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
