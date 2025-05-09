import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { RouterModule } from '@nestjs/core';
import { ApiModule } from '~/modules/api.module';
import { WebsiteModule } from '~/modules/website.module';
import { SpaFallbackMiddleware } from './middlewares/spa-fallback.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '../../../../.env'),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([]),
    WebsiteModule,
    ApiModule,
    RouterModule.register([
      {
        path: 'api',
        module: ApiModule,
      },
    ]),
  ],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SpaFallbackMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
