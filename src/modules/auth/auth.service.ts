import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserModel } from 'models/user.model'
import { JwtPayload, JwtResponse } from 'modules/auth/strategies/jwt.strategy'

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  async login(user: UserModel): Promise<JwtResponse> {
    const payload: JwtPayload = { uid: user.id, pem: user.permissions }

    return {
      accessToken: this.jwt.sign(payload),
    }
  }
}
