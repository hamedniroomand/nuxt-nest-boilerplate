import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';
import { FastifyReply } from 'fastify';
import { readFileSync } from 'fs';

@Controller()
export class AppController {
  @Get('*')
  serveAll(@Res() reply: FastifyReply) {
    const filePath = join(__dirname, '../../../client/public/200.html');
    const content = readFileSync(filePath, 'utf-8');
    return reply.type('text/html').send(content);
  }
}
