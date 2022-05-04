import { Injectable } from '@nestjs/common'
import { UserModel } from 'models/user.model'
import { JwtPayload, JwtResponse } from 'modules/auth/strategies/jwt.strategy'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}

  async create(user: UserModel): Promise<JwtResponse> {
    const payload: JwtPayload = { uid: user.id, pem: user.permissions }

    return {
      accessToken: this.jwt.sign(payload),
    }
  }
}
