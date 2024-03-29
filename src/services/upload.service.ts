import { ConfigItem, ConfigService } from 'services/config.service'
import { PutObjectCommand, S3 } from '@aws-sdk/client-s3'
import { extension, lookup } from 'mime-types'
import { SUPPORTED_UPLOAD_MIME_TYPES } from 'consts'
import { Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server-express'
import { UploadErrorIds } from 'errors'

@Injectable()
export class UploadService {
  private readonly client = new S3({
    endpoint: `https://${ConfigService.get(ConfigItem.CDNEndpoint)}`,
    region: ConfigService.get(ConfigItem.CDNRegion),
    credentials: {
      accessKeyId: ConfigService.get(ConfigItem.CDNApiKey, true),
      secretAccessKey: ConfigService.get(ConfigItem.CDNApiSecret, true),
    },
  })

  private static params(
    directory: string,
    name: string,
    file: Express.Multer.File,
  ): PutObjectCommand['input'] {
    return {
      Bucket: ConfigService.get(ConfigItem.CDNSpace),
      Key: `${directory}/${name}`,
      ACL: 'public-read',
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.size,
    }
  }

  public async upload(
    directory: string,
    name: string,
    file: Express.Multer.File,
  ): Promise<boolean> {
    try {
      const params = UploadService.params(directory, name, file)

      // const parallel = new Upload({
      //   client: this.client,
      //   leavePartsOnError: false,
      //   params,
      // })

      await this.client.putObject(params)

      // await parallel.done()

      return true
    } catch (error) {
      console.error(error)

      throw new ApolloError(UploadErrorIds.GenericInternalError)
    }
  }

  public uploadImageToAlbum(
    id: string,
    albumId: string,
    authorId: string,
    file: Express.Multer.File,
  ): Promise<boolean> {
    if (!SUPPORTED_UPLOAD_MIME_TYPES.includes(file.mimetype)) {
      throw new UserInputError(UploadErrorIds.InvalidExtension)
    }

    const extLookup = lookup(file.originalname)
    const ext = extLookup && extension(extLookup)

    return this.upload(
      `users/${authorId}/albums/${albumId}`,
      `${id}.${ext}`,
      file,
    )
  }

  public async uploadImagesToAlbum(
    id: string,
    albumId: string,
    authorId: string,
    files: Express.Multer.File[],
  ) {
    for (const file of files) {
      await this.uploadImageToAlbum(id, albumId, authorId, file)
    }
  }

  public uploadAlbumCover(
    id: string,
    authorId: string,
    file: Express.Multer.File,
  ): Promise<boolean> {
    if (!SUPPORTED_UPLOAD_MIME_TYPES.includes(file.mimetype)) {
      throw new UserInputError(UploadErrorIds.InvalidExtension)
    }

    const extLookup = lookup(file.originalname)
    const ext = extLookup && extension(extLookup)

    return this.upload(`users/${authorId}/albums/${id}`, `cover.${ext}`, file)
  }

  public uploadUserBanner(
    userId: string,
    file: Express.Multer.File,
  ): Promise<boolean> {
    if (!SUPPORTED_UPLOAD_MIME_TYPES.includes(file.mimetype)) {
      throw new UserInputError(UploadErrorIds.InvalidExtension)
    }

    const extLookup = lookup(file.originalname)
    const ext = extLookup && extension(extLookup)

    return this.upload(`users/${userId}`, `banner.${ext}`, file)
  }

  static getUrlForAlbumCover(
    userId: string,
    albumId: string,
    coverExt: string,
  ): string {
    return `${ConfigService.get(
      ConfigItem.CDNUrl,
    )}/users/${userId}/albums/${albumId}/cover.${coverExt}`
  }

  static getUrlForImage(
    userId: string,
    albumId: string,
    imageId: string,
    imageExt: string,
  ): string {
    return `${ConfigService.get(
      ConfigItem.CDNUrl,
    )}/users/${userId}/albums/${albumId}/${imageId}.${imageExt}`
  }
}
