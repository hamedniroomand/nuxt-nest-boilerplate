import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import compression from '@fastify/compress';
import helmet from '@fastify/helmet';
import { join } from 'path';
import fastifyStatic from '@fastify/static';
import { AppModule } from './app.module';
import { wait } from 'shared/utils';

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
    root: join(__dirname, '../../client/public'),
    prefix: '/',
    decorateReply: false,
    serve: true,
  });

  await app.listen(process.env.PORT ?? 3030, '0.0.0.0');
  await wait(10);
  const appUrl = await app.getUrl();
  console.log(`Server is running on ${appUrl}`);
}

bootstrap().catch(console.error);
