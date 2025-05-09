import { Module } from '@nestjs/common';
import { AppController } from '../controllers';

@Module({
  controllers: [AppController],
  providers: [],
})
export class WebsiteModule {}
