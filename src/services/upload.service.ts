import { ConfigItem, ConfigService } from 'services/config.service'
import { PutObjectCommand, S3 } from '@aws-sdk/client-s3'
import { extension, lookup } from 'mime-types'
import { SUPPORTED_UPLOAD_MIME_TYPES } from 'consts'
import { Injectable } from '@nestjs/common'
import { GalliaryError, GError } from 'services/error.service'
import { FileUpload } from 'graphql-upload'
import { PassThrough } from 'stream'
import { Upload } from '@aws-sdk/lib-storage'

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

  private params(
    directory: string,
    name: string,
    file: FileUpload,
  ): PutObjectCommand['input'] {
    return {
      Bucket: ConfigService.get(ConfigItem.CDNSpace),
      Key: `${directory}/${name}`,
      Body: file.createReadStream(),
      ACL: 'public-read',
    }
  }

  private isValidImage(file: FileUpload): GError | true {
    if (!SUPPORTED_UPLOAD_MIME_TYPES.includes(file.mimetype)) {
      return GError.ImageInvalidExtension
    }

    return true
  }

  public async upload(
    directory: string,
    name: string,
    file: FileUpload,
  ): Promise<boolean> {
    try {
      const params = this.params(directory, name, file)

      const parallel = new Upload({
        client: this.client,
        leavePartsOnError: false,
        params,
      })

      await parallel.done()

      return true
    } catch (error) {
      console.error(error)

      throw new GalliaryError(GError.InternalServerError)
    }
  }

  public uploadImageToAlbum(
    id: string,
    albumId: string,
    authorId: string,
    file: FileUpload,
  ): Promise<boolean> {
    const isValid = this.isValidImage(file)
    if (isValid !== true) {
      throw new GalliaryError(isValid)
    }

    const extLookup = lookup(file.filename)
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
    files: FileUpload[],
  ) {
    for (const file of files) {
      await this.uploadImageToAlbum(id, albumId, authorId, file)
    }
  }

  public uploadAlbumCover(
    id: string,
    authorId: string,
    file: FileUpload,
  ): Promise<boolean> {
    const isValid = this.isValidImage(file)
    if (isValid !== true) {
      throw new GalliaryError(isValid)
    }

    const extLookup = lookup(file.filename)
    const ext = extLookup && extension(extLookup)

    return this.upload(`users/${authorId}/albums/${id}`, `cover.${ext}`, file)
  }

  public uploadUserBanner(userId: string, file: FileUpload): Promise<boolean> {
    const isValid = this.isValidImage(file)
    if (isValid !== true) {
      throw new GalliaryError(isValid)
    }

    const extLookup = lookup(file.filename)
    const ext = extLookup && extension(extLookup)

    return this.upload(`users/${userId}`, `banner.${ext}`, file)
  }
}
