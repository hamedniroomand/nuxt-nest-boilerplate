import KeyvRedis from '@keyv/redis';
import { ConfigService } from '@nestjs/config';

export const redisConfig = {
  useFactory: (configService: ConfigService) => {
    return {
      stores: [new KeyvRedis(configService.get<string>('REDIS_URI'))],
      namespace: 'cache',
    };
  },
  inject: [ConfigService],
};
