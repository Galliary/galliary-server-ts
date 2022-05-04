import { BadRequestException, Injectable } from '@nestjs/common'
import { Profile as DiscordProfile } from 'passport-discord'
import { AccessTokens } from 'modules/auth/auth.controller'
import { UserService } from 'modules/user/user.service'
import { UserConnectionType } from '@prisma/client'
import { TokenService } from 'modules/token/token.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly tokens: TokenService,
  ) {}

  async discordAuthCallback(profile: DiscordProfile, tokens: AccessTokens) {
    if (profile.provider !== 'discord' || !profile.id) {
      throw new BadRequestException('Invalid body.')
    }

    const existing = await this.users.byConnectionId(
      profile.id,
      UserConnectionType.DISCORD,
    )

    if (existing) {
      return this.tokens.create(existing)
    } else {
      const user = await this.users.createByDiscordConnection(profile, tokens)

      return this.tokens.create(user)
    }
  }
}
