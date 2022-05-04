import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigItem, ConfigService } from 'services/config.service'
import { Field, ObjectType } from '@nestjs/graphql'
import { PermissionManager } from 'utils/permissions'

export interface JwtPayload {
  uid: string
  pem: number
}

export interface JwtUser {
  id: string
  permissions: PermissionManager
  jwt: JwtPayload
}

@ObjectType()
export class JwtResponse {
  @Field(() => String)
  accessToken: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ConfigService.get(ConfigItem.Secret),
    })
  }

  validate(payload: JwtPayload): JwtUser {
    return {
      jwt: payload,
      id: payload.uid,
      permissions: new PermissionManager(payload.pem),
    }
  }
}
