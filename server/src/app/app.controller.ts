import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  index() {
    return {
      name: 'guss server',
    };
  }
}
