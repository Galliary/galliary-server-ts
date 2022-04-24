import { Injectable, NotFoundException } from '@nestjs/common'
import { UserModel, UserWithPasswordModel } from 'models/user.model'
import { PrismaService } from 'services/prisma.service'
import { CreateUserInput, UpdateUserInput } from 'modules/user/user.inputs'
import { omit } from 'lodash'
import { snowflake } from 'utils/snowflake'
import { hashPassword } from 'utils/passwords'
import { AuthenticationError, UserInputError } from 'apollo-server-express'
import { AuthService } from 'modules/auth/auth.service'
import { JwtResponse, JwtUser } from 'modules/auth/strategies/jwt.strategy'
import { compare } from 'bcrypt'
import { Permissions, USER_DEFAULT_PERMISSIONS } from 'utils/permissions'
import { InjectMeiliSearch } from 'nestjs-meilisearch'
import { Hits, MeiliSearch } from 'meilisearch'
import { Image, User } from '@prisma/client'
import { ImageModel } from 'models/image.model'
import {
  SearchDocument,
  SearchUserDocument,
} from 'models/search-document.model'
import { SearchIndex } from 'utils/search'
import { UpdateImageInput } from 'modules/image/image.inputs'
import { ImageErrorIds, UserErrorIds } from 'errors'
import { passValue } from 'utils/handlers'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
    @InjectMeiliSearch()
    private readonly meili: MeiliSearch,
  ) {}

  static toIndexDocument(user: User | UserModel | JwtUser): SearchUserDocument {
    return {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  search(query: string): Promise<Hits<SearchUserDocument>> {
    return this.meili
      .index(SearchIndex.Users)
      .search<SearchUserDocument>(query)
      .then((res) => res.hits)
      .then((res) =>
        res.map((item) => {
          return {
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }
        }),
      )
  }

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

  get(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }

  byEmailOrUsername(emailOrUsername: string): Promise<UserWithPasswordModel> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ username: emailOrUsername }, { email: emailOrUsername }],
      },
    })
  }

  async create(input: CreateUserInput) {
    const hashedPassword = await hashPassword(input.password)

    await this.prisma.user
      .create({
        data: {
          ...omit(input, ['password']),
          id: snowflake(),
          createdAt: new Date(),
          updatedAt: new Date(),
          hashedPassword,
          permissions: USER_DEFAULT_PERMISSIONS,
        },
      })
      .then((data) => {
        this.meili
          .index(SearchIndex.Users)
          .addDocuments([UserService.toIndexDocument(data)])
          .catch(console.error)

        return data
      })

    return true
  }

  update(author: JwtUser, userId: string, input: UpdateUserInput) {
    if (
      author.id !== userId &&
      !author.permissions.has(Permissions.MODERATE_USERS)
    ) {
      throw new UserInputError(UserErrorIds.NoPermissionToEdit)
    }

    return this.prisma.user
      .update({
        where: { id: userId },
        data: {
          ...input,
          updatedAt: new Date(),
        },
      })
      .then((data) =>
        this.meili
          .index(SearchIndex.Users)
          .updateDocuments([UserService.toIndexDocument(data)]),
      )
      .then(passValue(true))
  }
}
