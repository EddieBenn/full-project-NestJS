import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipAuth } from './auth/auth.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@SkipAuth()
@ApiTags('Base Route')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({ status: 200, description: 'Api working properly' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
