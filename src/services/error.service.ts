import { ApolloError } from 'apollo-server-express'

export enum GError {
  UnknownError = 0,
  InternalServerError = 1 << 0,

  ImageInvalidSize = 1 << 1,
  ImageInvalidExtension = 1 << 2,

  HeadersMissingContentLength = 1 << 3,
}

export const GErrorMap = {
  [GError.UnknownError]: 'error.unknown',
  [GError.ImageInvalidSize]: 'error.images.invalid.size',
  [GError.ImageInvalidExtension]: 'error.images.invalid.extension',
  [GError.HeadersMissingContentLength]: 'error.headers.missing.content-length',
}

export class GalliaryError extends ApolloError {
  constructor(private readonly code: GError) {
    super(GErrorMap[code])

    this.message = GErrorMap[code ?? GError.InternalServerError]
  }

  public getCode(): GError {
    return this.code
  }

  public getMessageId(): string {
    return GErrorMap[this.code]
  }
}
