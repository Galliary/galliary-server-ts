export const JWT_EXPIRY = '8d'
export const CONFIG_FILE_NAME = '.env'
export const SUPPORTED_UPLOAD_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/bmp',
]
export const MAX_UPLOAD_FILE_SIZE = 64 * 1024 * 1024
export const MAX_UPLOAD_FILE_COUNT = 8

export const PORT = Number(process.env.PORT ?? 8080)
