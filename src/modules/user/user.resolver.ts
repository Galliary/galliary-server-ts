import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { UserService } from 'modules/user/user.service'
import { UserModel } from 'models/user.model'
import { CreateUserInput } from 'modules/user/user.inputs'
import { JwtResponse } from 'modules/auth/strategies/jwt.strategy'
import { CurrentUser } from 'decorators/current-user.decorator'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'modules/auth/strategies/jwt.guard'
import { AlbumModel } from 'models/album.model'
import { AlbumService } from 'modules/album/album.service'

@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    private readonly service: UserService,
    private readonly albumService: AlbumService,
  ) {}

  @Query(() => UserModel)
  @UseGuards(JwtAuthGuard)
  user(@CurrentUser() user, @Args('id', { nullable: true }) id?: string) {
    if (!id) return user
    return this.service.byId(id)
  }

  @ResolveField(() => [AlbumModel])
  @UseGuards(JwtAuthGuard)
  albums(@Parent() user: UserModel) {
    return this.albumService.byAuthor(user.id)
  }

  @Mutation(() => Boolean)
  async createUser(@Args() input: CreateUserInput) {
    return this.service.create(input)
  }

  @Mutation(() => JwtResponse)
  async login(
    @Args('emailOrUsername') emailOrUsername: string,
    @Args('password') password: string,
  ) {
    return this.service.validateUser(emailOrUsername, password)
  }
}
