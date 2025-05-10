import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import { redisConfig } from '~/config/redis';
import { mongooseConfig } from '~/config/mongoose';
import { SpaFallbackMiddleware } from '~/middlewares/spa-fallback.middleware';
import { AppController } from '~/controllers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '../../../../.env'),
    }),
    MongooseModule.forRootAsync(mongooseConfig),
    CacheModule.registerAsync(redisConfig),
    MongooseModule.forFeature([]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SpaFallbackMiddleware);
  }
}
