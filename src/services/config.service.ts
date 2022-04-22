import { parse } from 'dotenv'
import { readFileSync } from 'fs'
import { join } from 'path'
import { CONFIG_FILE_NAME } from 'consts'

export enum ConfigItem {
  Secret = 'SECRET',

  CDNUrl = 'CDN_URL',
  CDNSpace = 'CDN_SPACE',
  CDNRegion = 'CDN_REGION',
  CDNEndpoint = 'CDN_ENDPOINT',
  CDNApiKey = 'CDN_API_KEY',
  CDNApiSecret = 'CDN_API_SECRET',
}

export class ConfigService {
  private static readonly env = parse(
    readFileSync(join(process.cwd(), CONFIG_FILE_NAME)),
  )

  static get(key: ConfigItem, throwIfEmpty = false): string {
    const value = this.env[key]
    if (throwIfEmpty && !value) {
      throw new Error('Missing config value: ' + key)
    }
    return value
  }
}
