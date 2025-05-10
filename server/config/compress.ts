import { FastifyCompressOptions } from '@fastify/compress';

export const compressConfig: FastifyCompressOptions = {
  encodings: ['gzip', 'deflate'],
  threshold: 1024,
};
