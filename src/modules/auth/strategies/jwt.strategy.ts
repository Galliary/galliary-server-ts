import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigItem, ConfigService } from 'services/config.service'
import { Field, ObjectType } from '@nestjs/graphql'
import { UserModel } from 'models/user.model'
import { UserService } from 'modules/user/user.service'
import { PermissionManager } from 'utils/permissions'

export interface JwtPayload {
  uid: string
  pem: number
}

export interface JwtUser extends Omit<UserModel, 'permissions'> {
  jwt: JwtPayload
  permissions: PermissionManager
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
    const user = await this.user.get(payload.uid)
    return {
      ...user,
      permissions: new PermissionManager(user.permissions),
      jwt: payload,
    }
  }
}
