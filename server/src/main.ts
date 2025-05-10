import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import compression from '@fastify/compress';
import helmet from '@fastify/helmet';
import { setupSwagger } from 'config/swagger';
import { helmetConfig } from 'config/helmet';
import { compressConfig } from 'config/compress';
import { setupStaticFile } from 'config/static-file';
import { wait } from '@shared/utils';
import { AppModule } from '~/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: false },
  );

  await app.register(helmet, helmetConfig);

  await app.register(compression, compressConfig);

  await setupStaticFile(app);

  const { path } = setupSwagger(app);

  const fallbackPort = 3000;
  const port =
    process.env.NODE_ENV === 'production'
      ? fallbackPort
      : process.env.SERVER_PORT;

  app.setGlobalPrefix('api');

  await app.listen(port || fallbackPort, '0.0.0.0');

  await wait(10);

  const appUrl = await app.getUrl();

  console.log(`Server is running on ${appUrl}`);
  console.log(`Swagger is running on ${appUrl}/${path}`);
}

bootstrap().catch(console.error);
