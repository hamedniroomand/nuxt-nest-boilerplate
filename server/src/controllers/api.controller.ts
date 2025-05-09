import { Controller, Get } from '@nestjs/common';

@Controller()
export class ApiController {
  @Get('ping')
  getPing() {
    return {
      message: 'pong',
    };
  }
}
