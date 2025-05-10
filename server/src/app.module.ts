import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { RouterModule } from '@nestjs/core';
import { ApiModule } from '~/modules/api.module';
import { WebsiteModule } from '~/modules/website.module';
import { SpaFallbackMiddleware } from './middlewares/spa-fallback.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { redisConfig } from 'config/redis';
import { mongooseConfig } from 'config/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '../../../../.env'),
    }),
    MongooseModule.forRootAsync(mongooseConfig),
    CacheModule.registerAsync(redisConfig),
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
