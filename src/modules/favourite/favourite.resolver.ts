import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { ReportModel } from 'models/report.model'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard'
import { CurrentUser } from 'decorators/current-user.decorator'
import { WithPermissions } from 'decorators/with-permissions.decorator'
import { Permissions } from 'utils/permissions'
import { JwtUser } from 'modules/auth/strategies/jwt.strategy'
import { FavouriteService } from 'modules/favourite/favourite.service'
import {
  FavouriteAlbumInput,
  FavouriteImageInput,
  FavouriteUserInput,
} from 'modules/favourite/favourite.inputs'

@Resolver(() => ReportModel)
@UseGuards(JwtAuthGuard)
export class FavouriteResolver {
  constructor(private readonly service: FavouriteService) {}

  @Mutation(() => Boolean)
  @WithPermissions(Permissions.CREATE_REPORTS)
  favouriteAlbum(
    @CurrentUser() author: JwtUser,
    @Args() input: FavouriteAlbumInput,
  ) {
    return this.service.favouriteAlbum(author, input)
  }

  @Mutation(() => Boolean)
  @WithPermissions(Permissions.CREATE_REPORTS)
  favouriteImage(
    @CurrentUser() author: JwtUser,
    @Args() input: FavouriteImageInput,
  ) {
    return this.service.favouriteImage(author, input)
  }

  @Mutation(() => Boolean)
  @WithPermissions(Permissions.CREATE_REPORTS)
  favouriteUser(
    @CurrentUser() author: JwtUser,
    @Args() input: FavouriteUserInput,
  ) {
    return this.service.favouriteUser(author, input)
  }
}
