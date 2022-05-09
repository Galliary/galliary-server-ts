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
import { SimplePaginationArgs } from 'errors'
import { PermissionGuard } from 'guards/permission.guard'

@Resolver(() => UserModel)
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UserResolver {
  constructor(
    private readonly service: UserService,
    private readonly imageService: ImageService,
    private readonly albumService: AlbumService,
  ) {}

  @Query(() => UserModel, { nullable: true })
  @WithPermissions(Permissions.VIEW_ENTITIES)
  user(
    @CurrentUser() user: JwtUser,
    @Args('id', { nullable: true }) id?: string,
  ) {
    return this.service.get(id ?? user?.id)
  }

  @Query(() => [SearchUserDocument])
  @WithPermissions(Permissions.VIEW_ENTITIES)
  searchUsers(@Args('query') query: string): Promise<SearchUserDocument[]> {
    return this.service.search(query)
  }

  @ResolveField(() => [ImageModel])
  @WithPermissions(Permissions.VIEW_ENTITIES)
  images(
    @CurrentUser() user: JwtUser,
    @Parent() author: UserModel,
    @Args() args: SimplePaginationArgs,
  ) {
    return this.imageService.byAuthor(author.id, user, args)
  }

  @ResolveField(() => [AlbumModel])
  @WithPermissions(Permissions.VIEW_ENTITIES)
  albums(
    @CurrentUser() user: JwtUser,
    @Parent() author: UserModel,
    @Args() args: SimplePaginationArgs,
  ) {
    return this.albumService.byAuthor(author.id, user, args)
  }

  @ResolveField(() => [AlbumModel])
  @WithPermissions(Permissions.VIEW_ENTITIES)
  favouriteAlbums(
    @CurrentUser() user: JwtUser,
    @Parent() author: UserModel,
    @Args() args: SimplePaginationArgs,
  ) {
    return this.albumService.favouritedByUser(author.id, user, args)
  }

  @ResolveField(() => [ImageModel])
  @WithPermissions(Permissions.VIEW_ENTITIES)
  favouriteImages(
    @CurrentUser() user: JwtUser,
    @Parent() author: UserModel,
    @Args() args: SimplePaginationArgs,
  ) {
    return this.imageService.favouritedByUser(author.id, user, args)
  }

  @ResolveField(() => [UserModel])
  @WithPermissions(Permissions.VIEW_ENTITIES)
  favouriteUsers(
    @CurrentUser() user: JwtUser,
    @Parent() author: UserModel,
    @Args() args: SimplePaginationArgs,
  ) {
    return this.service.favouritedByUser(author.id, user, args)
  }

  @Mutation(() => Boolean)
  @WithPermissions(Permissions.UPDATE_OWNED_ENTITIES)
  updateUser(
    @CurrentUser() author: JwtUser,
    @Args('authorId') authorId: string,
    @Args() input: UpdateUserInput,
  ) {
    return this.service.update(author, authorId, input)
  }

  @Mutation(() => Boolean)
  createUser(@Args() input: CreateUserInput) {
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
