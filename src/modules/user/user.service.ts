import { Injectable, NotFoundException } from '@nestjs/common'
import { UserWithPasswordModel } from 'models/user.model'
import { PrismaService } from 'services/prisma.service'
import { CreateUserInput } from 'modules/user/user.inputs'
import { omit } from 'lodash'
import { snowflake } from 'utils/snowflake'
import { hashPassword } from 'utils/passwords'
import { AuthenticationError } from 'apollo-server-express'
import { AuthService } from 'modules/auth/auth.service'
import { JwtResponse } from 'modules/auth/strategies/jwt.strategy'
import { compare } from 'bcrypt'
import { USER_DEFAULT_PERMISSIONS } from 'utils/permissions'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
  ) {}

  async validateUser(
    emailOrUsername: string,
    password: string,
  ): Promise<JwtResponse> {
    const user = await this.byEmailOrUsername(emailOrUsername)
    if (!user) {
      throw new NotFoundException('User not found.')
    }

    const passwordIsMatch = await compare(password, user.hashedPassword)

    if (passwordIsMatch) {
      return this.auth.login(user)
    }

    throw new AuthenticationError('Failed to authenticate user')
  }

  byId(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }

  byEmailOrUsername(emailOrUsername: string): Promise<UserWithPasswordModel> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ username: emailOrUsername }, { email: emailOrUsername }],
      },
      include: {
        albums: true,
      },
    })
  }

  async create(input: CreateUserInput) {
    const hashedPassword = await hashPassword(input.password)

    await this.prisma.user.create({
      data: {
        ...omit(input, ['password']),
        id: snowflake(),
        createdAt: new Date(),
        updatedAt: new Date(),
        hashedPassword,
        permissions: USER_DEFAULT_PERMISSIONS,
      },
    })

    return true
  }
}
