import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

@Injectable()
export class SpaFallbackMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply['raw'], next: () => void) {
    const url = req.originalUrl || '/';

    if (
      url.startsWith('/api') ||
      url.startsWith('/_nuxt') ||
      (url.includes('.') && !url.endsWith('.html'))
    ) {
      return next();
    }

    try {
      const clientDir = join(process.cwd(), 'dist', 'client', 'public');

      const normalizedPath = url.split('?')[0];

      let staticFilePath = '';

      if (normalizedPath === '/') {
        staticFilePath = join(clientDir, 'index.html');
      } else {
        const dirPath = normalizedPath.endsWith('/')
          ? normalizedPath.slice(0, -1)
          : normalizedPath;

        const pathsToTry = [
          join(clientDir, `${dirPath.substring(1)}.html`),
          join(clientDir, `${dirPath.substring(1)}/index.html`),
          join(clientDir, `${dirPath.substring(1)}`, 'index.html'),
        ];

        for (const path of pathsToTry) {
          if (existsSync(path)) {
            staticFilePath = path;
            break;
          }
        }
      }

      if (staticFilePath && existsSync(staticFilePath)) {
        return next();
      }

      const fallbackFilePath = join(clientDir, '200.html');

      if (!existsSync(fallbackFilePath)) {
        console.error('SPA fallback file not found:', fallbackFilePath);
        return next();
      }

      const content = readFileSync(fallbackFilePath, 'utf-8');

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.statusCode = 200;

      res.end(content);
    } catch (error) {
      console.error('Error in SPA fallback middleware:', error);
      next();
    }
  }
}
