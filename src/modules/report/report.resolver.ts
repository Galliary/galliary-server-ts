import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { UserModel } from 'models/user.model'
import { ReportModel } from 'models/report.model'
import { UserService } from 'modules/user/user.service'
import { AlbumService } from 'modules/album/album.service'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard'
import { CurrentUser } from 'decorators/current-user.decorator'
import { AlbumModel } from 'models/album.model'
import { ReportService } from 'modules/report/report.service'
import { ImageService } from 'modules/image/image.service'
import { WithPermissions } from 'decorators/with-permissions.decorator'
import { Permissions } from 'utils/permissions'
import { ImageModel } from 'models/image.model'
import {
  ReportAlbumInput,
  ReportImageInput,
  ReportUserInput,
} from 'modules/report/report.inputs'
import { JwtUser } from 'modules/auth/strategies/jwt.strategy'
import { passValue } from 'utils/handlers'

@Resolver(() => ReportModel)
@UseGuards(JwtAuthGuard)
export class ReportResolver {
  constructor(
    private readonly service: ReportService,
    private readonly albums: AlbumService,
    private readonly images: ImageService,
    private readonly users: UserService,
  ) {}

  @Mutation(() => Boolean)
  @WithPermissions(Permissions.CREATE_REPORTS)
  reportAlbum(@CurrentUser() author: JwtUser, @Args() input: ReportAlbumInput) {
    return this.service.create(author, input)
  }

  @Mutation(() => Boolean)
  @WithPermissions(Permissions.CREATE_REPORTS)
  reportImage(@CurrentUser() author: JwtUser, @Args() input: ReportImageInput) {
    return this.service.create(author, input)
  }

  @Mutation(() => Boolean)
  @WithPermissions(Permissions.CREATE_REPORTS)
  reportUser(@CurrentUser() author: JwtUser, @Args() input: ReportUserInput) {
    return this.service.create(author, input)
  }

  @Query(() => ReportModel, { nullable: true })
  @WithPermissions(Permissions.VIEW_REPORTS)
  report(@Args('id') id: string) {
    return this.service.get(id)
  }

  @Query(() => [ReportModel])
  @WithPermissions(Permissions.VIEW_REPORTS)
  reports() {
    return this.service.all()
  }

  @Query(() => [ReportModel])
  @WithPermissions(Permissions.VIEW_REPORTS)
  reportsForAlbum(@Args('albumId') albumId: string) {
    // TODO: Implement reports for albums
    return []
  }

  @Query(() => [ReportModel])
  @WithPermissions(Permissions.VIEW_REPORTS)
  reportsForImage(@Args('imageId') imageId: string) {
    // TODO: Implement reports for images
    return []
  }

  @Query(() => [ReportModel])
  @WithPermissions(Permissions.VIEW_REPORTS)
  reportsForUser(@Args('userId') userId: string) {
    // TODO: Implement reports for images
    return []
  }

  @ResolveField(() => AlbumModel, { nullable: true })
  @WithPermissions(Permissions.VIEW_REPORTS)
  album(@Parent() report: ReportModel) {
    return this.albums.get(report.albumId).catch(passValue(null))
  }

  @ResolveField(() => ImageModel, { nullable: true })
  @WithPermissions(Permissions.VIEW_REPORTS)
  image(@Parent() report: ReportModel) {
    return this.images.get(report.imageId).catch(passValue(null))
  }

  @ResolveField(() => UserModel, { nullable: true })
  @WithPermissions(Permissions.VIEW_REPORTS)
  user(@Parent() report: ReportModel) {
    return this.users.get(report.userId).catch(passValue(null))
  }

  @ResolveField(() => UserModel, { nullable: true })
  @WithPermissions(Permissions.VIEW_REPORTS)
  assignee(@Parent() report: ReportModel) {
    return this.users.get(report.assigneeId).catch(passValue(null))
  }

  @ResolveField(() => UserModel, { nullable: true })
  @WithPermissions(Permissions.VIEW_REPORTS)
  reportee(@Parent() report: ReportModel) {
    return this.users.get(report.reporteeId).catch(passValue(null))
  }
}
