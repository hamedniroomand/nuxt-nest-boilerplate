import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

export const mongooseConfig = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI'),
  }),
  inject: [ConfigService],
};
