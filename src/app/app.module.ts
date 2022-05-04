import { join } from 'path'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { MiddlewareConsumer, Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { AppController } from 'app/app.controller'
import { AppService } from 'app/app.service'
import { AlbumModule } from 'modules/album/album.module'
import { UserModule } from 'modules/user/user.module'
import { PassportModule } from '@nestjs/passport'
import { ConfigItem, ConfigService } from 'services/config.service'
import { GraphQLError, GraphQLFormattedError } from 'graphql'
import { GraphQLUpload, graphqlUploadExpress } from 'graphql-upload'
import { ImageModule } from 'modules/image/image.module'
import { ReportModule } from 'modules/report/report.module'
import { MeiliSearchModule } from 'nestjs-meilisearch'
import { ThrottlerModule } from '@nestjs/throttler'
import { AuthModule } from 'modules/auth/auth.module'
import { FavouriteModule } from 'modules/favourite/favourite.module'

@Module({
  imports: [
    PassportModule,
    AuthModule,
    UserModule,
    ImageModule,
    AlbumModule,
    ReportModule,
    FavouriteModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 5,
    }),
    MeiliSearchModule.forRoot({
      host: ConfigService.get(ConfigItem.MeiliSearchHost),
      apiKey: ConfigService.get(ConfigItem.MeiliSearchKey),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      sortSchema: true,
      autoSchemaFile: join(process.cwd(), 'generated/schema.gql'),
      resolvers: { Upload: GraphQLUpload },
      subscriptions: {
        'graphql-ws': true,
      },
      formatError(error: GraphQLError): GraphQLFormattedError {
        return {
          message: error.message,
        }
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql')
  }
}
