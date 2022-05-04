import { Strategy } from 'passport-discord'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigItem, ConfigService } from 'services/config.service'

export class DiscordOAuthStrategy extends PassportStrategy(
  Strategy,
  'discord-oauth',
) {
  constructor() {
    super(
      {
        clientID: ConfigService.get(ConfigItem.DiscordClientId, true),
        clientSecret: ConfigService.get(ConfigItem.DiscordClientSecret, true),
        callbackURL: ConfigService.get(ConfigItem.DiscordCallbackUri, true),
        scope: 'identify email',
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile, { accessToken, refreshToken })
      },
    )
  }
}
