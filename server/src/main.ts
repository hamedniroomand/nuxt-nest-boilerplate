import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import compression from '@fastify/compress';
import helmet from '@fastify/helmet';
import { join } from 'path';
import fastifyStatic from '@fastify/static';
import { wait } from '@shared/utils';
import { AppModule } from '~/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: false },
  );

  const fastifyInstance = app.getHttpAdapter().getInstance();

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'", 'ws:', 'wss:'],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
      },
    },
  });

  await app.register(compression, { encodings: ['gzip', 'deflate'] });

  await fastifyInstance.register(fastifyStatic, {
    root: join(__dirname, '../../client/public/_nuxt'),
    prefix: '/_nuxt',
    decorateReply: false,
    serve: true,
  });

  const fallbackPort = 3000;
  const port =
    process.env.NODE_ENV === 'production'
      ? fallbackPort
      : process.env.CLIENT_PORT;

  await app.listen(port || fallbackPort, '0.0.0.0');

  await wait(10);

  const appUrl = await app.getUrl();

  console.log(`Server is running on ${appUrl}`);
}

bootstrap().catch(console.error);
