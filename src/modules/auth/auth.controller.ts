import { Request, Response } from 'express'
import { AuthService } from 'modules/auth/auth.service'
import { Profile as DiscordProfile } from 'passport-discord'
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { DiscordOAuthGuard } from 'modules/auth/guards/discord.o-auth.guard'
import { ConfigItem, ConfigService } from 'services/config.service'

export type AccessTokens = { accessToken: string; refreshToken: string }

export type DiscordAuthRequest = Request & {
  user: DiscordProfile
  authInfo: AccessTokens
}

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @UseGuards(DiscordOAuthGuard)
  @Get('discord/login')
  async discordLogin() {
    return null // Gets redirected automatically
  }

  @UseGuards(DiscordOAuthGuard)
  @Get('discord/callback')
  async discordAuthCallback(
    @Req() { user, authInfo }: DiscordAuthRequest,
    @Res() res: Response,
  ) {
    const tokens = await this.service.discordAuthCallback(user, authInfo)
    if (tokens && tokens.accessToken) {
      return res.redirect(
        new URL(
          ConfigService.get(ConfigItem.AuthRedirect) +
            `?at=${encodeURIComponent(tokens.accessToken)}`,
        ).toString(),
      )
    }
  }
}
