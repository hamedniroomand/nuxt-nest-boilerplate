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
import { setupSwagger } from 'config/swagger';
import { helmetConfig } from 'config/helmet';
import { compressConfig } from 'config/compress';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: false },
  );

  const fastifyInstance = app.getHttpAdapter().getInstance();

  await app.register(helmet, helmetConfig);

  await app.register(compression, compressConfig);

  const clientDir = join(__dirname, '../../client/public');

  await fastifyInstance.register(fastifyStatic, {
    root: join(clientDir, '_nuxt'),
    prefix: '/_nuxt',
    decorateReply: false,
    cacheControl: true,
    etag: true,
    lastModified: true,
    immutable: true,
    maxAge: 31536000, // 1 year
    setHeaders: (res, pathName) => {
      // Most Nuxt builds add content hashes to filenames
      if (pathName.match(/[a-f0-9]{6,}/i)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
      }
    },
  });
  await fastifyInstance.register(fastifyStatic, {
    root: clientDir,
    prefix: '/',
    decorateReply: false,
    cacheControl: true,
    etag: true,
    lastModified: true,
    setHeaders: (res, pathName) => {
      if (pathName.endsWith('.html')) {
        // HTML files: short cache with validation
        res.setHeader('Cache-Control', 'public, max-age=600, must-revalidate');
      } else if (/\.(jpg|jpeg|png|gif|svg|webp|ico)$/.test(pathName)) {
        // Images: medium cache
        res.setHeader('Cache-Control', 'public, max-age=604800'); // 1 week
      } else if (/\.(woff|woff2|ttf|eot)$/.test(pathName)) {
        // Fonts: long cache
        res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 days
      } else if (/\.(mp4|webm|ogg)$/.test(pathName)) {
        // Media: medium cache
        res.setHeader('Cache-Control', 'public, max-age=604800'); // 1 week
      } else if (/\.(js|css)$/.test(pathName)) {
        // JS/CSS not in _nuxt: medium cache
        res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
      } else {
        // Other assets: default cache
        res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour
      }
    },
  });

  const { path } = setupSwagger(app);

  const fallbackPort = 3000;
  const port =
    process.env.NODE_ENV === 'production'
      ? fallbackPort
      : process.env.SERVER_PORT;

  await app.listen(port || fallbackPort, '0.0.0.0');

  await wait(10);

  const appUrl = await app.getUrl();

  console.log(`Server is running on ${appUrl}`);
  console.log(`Swagger is running on ${appUrl}/${path}`);
}

bootstrap().catch(console.error);
