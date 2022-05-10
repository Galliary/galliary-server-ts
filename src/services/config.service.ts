import { parse } from 'dotenv'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { CONFIG_FILE_NAME } from 'consts'

export enum ConfigItem {
  Secret = 'SECRET',

  RedisHost = 'REDIS_HOST',
  RedisPort = 'REDIS_PORT',

  CDNUrl = 'CDN_URL',
  CDNSpace = 'CDN_SPACE',
  CDNRegion = 'CDN_REGION',
  CDNEndpoint = 'CDN_ENDPOINT',
  CDNApiKey = 'CDN_API_KEY',
  CDNApiSecret = 'CDN_API_SECRET',

  MeiliSearchHost = 'MEILISEARCH_HOST',
  MeiliSearchKey = 'MEILISEARCH_KEY',

  DiscordClientId = 'DISCORD_CLIENT_ID',
  DiscordClientSecret = 'DISCORD_CLIENT_SECRET',
  DiscordCallbackUri = 'DISCORD_CALLBACK_URI',

  AuthRedirect = 'AUTH_REDIRECT',
}

const tryGetEnv = () => {
  const envPath = join(process.cwd(), CONFIG_FILE_NAME)

  if (existsSync(envPath)) {
    return parse(readFileSync(envPath))
  } else {
    return process.env
  }
}

export class ConfigService {
  private static readonly env = tryGetEnv()

  static get(key: ConfigItem, throwIfEmpty = false): string {
    const value = this.env[key]
    if (throwIfEmpty && !value) {
      throw new Error('Missing config value: ' + key)
    }

    // This is so dumb, but i want this to work
    return value
  }
}
