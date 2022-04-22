import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigItem, ConfigService } from 'services/config.service'
import { Field, ObjectType } from '@nestjs/graphql'
import { UserModel } from 'models/user.model'
import { UserService } from 'modules/user/user.service'

export interface JwtPayload {
  uid: string
  pem: number
}

export interface JwtUser extends UserModel {
  jwt: JwtPayload
}

@ObjectType()
export class JwtResponse {
  @Field(() => String)
  accessToken: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly user: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ConfigService.get(ConfigItem.Secret),
    })
  }

  // figure out wtf this do
  async validate(payload: JwtPayload): Promise<JwtUser> {
    const user = await this.user.byId(payload.uid)
    return { ...user, jwt: payload }
  }
}
