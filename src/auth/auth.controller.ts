import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SkipAuth } from './auth.decorator';
import { IReqUser } from 'src/base.entity';

@SkipAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async generateToken(@Body() user: IReqUser) {
    try {
      return this.authService.generateToken(user);
    } catch (error) {
      throw error;
    }
  }
}
