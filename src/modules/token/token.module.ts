import { JWT_EXPIRY } from 'consts'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TokenService } from 'modules/token/token.service'
import { ConfigItem, ConfigService } from 'services/config.service'
import { JwtStrategy } from 'modules/auth/strategies/jwt.strategy'

@Module({
  imports: [
    JwtModule.register({
      secret: ConfigService.get(ConfigItem.Secret),
      signOptions: { expiresIn: JWT_EXPIRY },
    }),
  ],
  providers: [JwtStrategy, TokenService],
  exports: [TokenService],
})
export class TokenModule {}
