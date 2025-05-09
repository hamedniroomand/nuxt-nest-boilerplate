import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

@Injectable()
export class SpaFallbackMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply['raw'], next: () => void) {
    const url = req.originalUrl || '/';

    // Skip processing for certain paths
    if (
      url.startsWith('/api') || // API routes
      url.startsWith('/_nuxt') || // Nuxt assets
      (url.includes('.') && !url.endsWith('.html')) // Files with extensions (except HTML)
    ) {
      return next();
    }

    try {
      const clientDir = join(process.cwd(), 'dist', 'client', 'public');

      // Clean and normalize the path
      const normalizedPath = url.split('?')[0]; // Remove query params

      // Check if there's a matching static HTML file
      let staticFilePath = '';

      if (normalizedPath === '/') {
        // Root path
        staticFilePath = join(clientDir, 'index.html');
      } else {
        // Try with trailing slash index.html
        const dirPath = normalizedPath.endsWith('/')
          ? normalizedPath.slice(0, -1)
          : normalizedPath;

        // Try multiple path variations to find a matching file
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

      // If a static file exists, let the static middleware handle it
      if (staticFilePath && existsSync(staticFilePath)) {
        return next();
      }

      // No static file found, serve the SPA fallback
      const fallbackFilePath = join(clientDir, '200.html');

      if (!existsSync(fallbackFilePath)) {
        console.error('SPA fallback file not found:', fallbackFilePath);
        return next(); // Let next middleware handle the 404
      }

      const content = readFileSync(fallbackFilePath, 'utf-8');

      // Set appropriate headers
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
