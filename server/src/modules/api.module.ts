import { Module } from '@nestjs/common';
import { ApiController } from '../controllers';

@Module({
  controllers: [ApiController],
  providers: [],
})
export class ApiModule {}
