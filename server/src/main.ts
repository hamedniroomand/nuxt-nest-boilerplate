import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import compression from '@fastify/compress';
import helmet from '@fastify/helmet';
import { setupSwagger } from '~/config/swagger';
import { helmetConfig } from '~/config/helmet';
import { compressConfig } from '~/config/compress';
import { setupStaticFile } from '~/config/static-file';
import { wait } from '@shared/utils';
import { AppModule } from '~/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: false },
  );

  const host = app.get(ConfigService).get<string>('VDOMAIN');

  await app.register(helmet, helmetConfig);

  await app.register(compression, compressConfig);

  await setupStaticFile(app);

  const { path } = setupSwagger(app);

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 3000, '0.0.0.0');

  await wait(10);

  const appUrl = await app.getUrl();

  if (process.env.NODE_ENV === 'development') {
    console.log(
      `application is running on http://${host}:${process.env.HOST_PORT}`,
    );
    console.log(
      `Swagger is running on http://${host}:${process.env.HOST_PORT}/${path}`,
    );
  } else {
    console.log(`application is running on ${appUrl}`);
  }
}

bootstrap().catch(console.error);
