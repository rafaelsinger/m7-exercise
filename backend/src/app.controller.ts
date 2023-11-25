import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/reset-database')
  async resetDatabase() {
    await this.appService.resetDatabase();
    return { message: 'Database reset successful' };
  }
}
