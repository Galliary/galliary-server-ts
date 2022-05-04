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
import { CreateUserInput, UpdateUserInput } from 'modules/user/user.inputs'
import { JwtResponse, JwtUser } from 'modules/auth/strategies/jwt.strategy'
import { CurrentUser } from 'decorators/current-user.decorator'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard'
import { AlbumModel } from 'models/album.model'
import { AlbumService } from 'modules/album/album.service'
import { SearchUserDocument } from 'models/search-document.model'
import { WithPermissions } from 'decorators/with-permissions.decorator'
import { Permissions } from 'utils/permissions'
import { ImageModel } from 'models/image.model'
import { ImageService } from 'modules/image/image.service'

@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    private readonly service: UserService,
    private readonly imageService: ImageService,
    private readonly albumService: AlbumService,
  ) {}

  @Query(() => UserModel, { nullable: true })
  @UseGuards(JwtAuthGuard)
  user(
    @CurrentUser() user: JwtUser,
    @Args('id', { nullable: true }) id?: string,
  ) {
    return this.service.get(id ?? user.id)
  }

  @Query(() => [SearchUserDocument])
  @WithPermissions(Permissions.VIEW_ENTITIES)
  searchUsers(@Args('query') query: string): Promise<SearchUserDocument[]> {
    return this.service.search(query)
  }

  @ResolveField(() => [ImageModel])
  @UseGuards(JwtAuthGuard)
  images(@Parent() user: UserModel) {
    return this.imageService.byAuthor(user.id)
  }

  @ResolveField(() => [AlbumModel])
  @UseGuards(JwtAuthGuard)
  albums(@Parent() user: UserModel) {
    return this.albumService.byAuthor(user.id)
  }

  @ResolveField(() => [AlbumModel])
  @UseGuards(JwtAuthGuard)
  favouriteAlbums(@Parent() user: UserModel) {
    return this.albumService.favouritedByUser(user.id)
  }

  @ResolveField(() => [ImageModel])
  @UseGuards(JwtAuthGuard)
  favouriteImages(@Parent() user: UserModel) {
    return this.imageService.favouritedByUser(user.id)
  }

  @ResolveField(() => [UserModel])
  @UseGuards(JwtAuthGuard)
  favouriteUsers(@Parent() user: UserModel) {
    return this.service.favouritedByUser(user.id)
  }

  @Mutation(() => Boolean)
  createUser(@Args() input: CreateUserInput) {
    return this.service.create(input)
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  updateUser(
    @CurrentUser() author: JwtUser,
    @Args('authorId') authorId: string,
    @Args() input: UpdateUserInput,
  ) {
    return this.service.update(author, authorId, input)
  }

  @Mutation(() => JwtResponse)
  async login(
    @Args('emailOrUsername') emailOrUsername: string,
    @Args('password') password: string,
  ) {
    return this.service.validateUser(emailOrUsername, password)
  }
}
