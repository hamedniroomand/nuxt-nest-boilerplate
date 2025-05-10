import fastifyStatic from '@fastify/static';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { cpSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export const setupStaticFile = async (app: NestFastifyApplication) => {
  const fastifyInstance = app.getHttpAdapter().getInstance();

  const clientDir = join(__dirname, '../../../client/public');

  // if (!existsSync(clientDir)) {
  //   mkdirSync(clientDir, { recursive: true });
  //   cpSync(
  //     join(__dirname, '../../../../../client/.output'),
  //     join(__dirname, '../../../client'),
  //     {
  //       recursive: true,
  //     },
  //   );
  // }

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
};
