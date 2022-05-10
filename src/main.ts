import { NestFactory } from '@nestjs/core'
import { AppModule } from 'app/app.module'
import { registerEnumType } from '@nestjs/graphql'
import {
  LockingStatus,
  PremiumFeature,
  SafetyRating,
  UserBadge,
} from '@prisma/client'
import { ValidationPipe } from '@nestjs/common'
import { PORT } from 'consts'

registerEnumType(LockingStatus, {
  name: 'LockingStatus',
})

registerEnumType(SafetyRating, {
  name: 'SafetyRating',
})

registerEnumType(UserBadge, {
  name: 'UserBadge',
})

registerEnumType(PremiumFeature, {
  name: 'PremiumFeature',
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe())

  app.enableCors({
    methods: ['GET', 'POST'],
    allowedHeaders: [
      'Content-Type',
      'Content-Length',
      'Authorization',
      'Accept',
    ],
    origin:
      process.env.NODE_ENV === 'production'
        ? [
            'https://galliary.com',
            'https://www.galliary.com',
            'https://api.galliary.com',
          ]
        : 'http://localhost:3000',
  })

  await app.listen(PORT)
}

bootstrap()
