import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { IsOptional, Max, Min } from 'class-validator'

export enum AlbumErrorIds {
  NotFound = 'errors.albums.not-found',
  NoPermissionToEdit = 'errors.albums.no-permission-to-edit',
  CoverInvalidMimeType = 'errors.albums.cover-invalid-mime-type',
}

export enum ImageErrorIds {
  NotFound = 'errors.images.not-found',
  NoPermissionToEdit = 'errors.images.no-permission-to-edit',
  InvalidMimeType = 'errors.images.invalid-mime-type',
}

export enum UploadErrorIds {
  InvalidExtension = 'errors.uploads.invalid-extension',
  GenericInternalError = 'errors.uploads.generic-internal-error',
}

export enum ReportErrorIds {
  ReportAlreadyMade = 'errors.reports.report-already-made',
  AlbumDoesNotExist = 'errors.reports.album-does-not-exist',
  ImageDoesNotExist = 'errors.reports.image-does-not-exist',
  UserDoesNotExist = 'errors.reports.user-does-not-exist',
}

export enum UserErrorIds {
  InvalidPermissions = 'errors.users.invalid-permissions',
  NoPermissionToEdit = 'errors.albums.no-permission-to-edit',
}

@ArgsType()
@InputType()
export class SimplePaginationArgs {
  @Field(() => Number, { nullable: true })
  @Min(0)
  @Max(100)
  @IsOptional()
  take?: number

  @Field(() => Number, { nullable: true })
  @Min(0)
  @Max(100)
  @IsOptional()
  skip?: number
}
