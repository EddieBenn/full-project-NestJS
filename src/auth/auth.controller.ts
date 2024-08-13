import {
  Controller,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SkipAuth } from './auth.decorator';

// @SkipAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post()
  // async generateToken(@Body() user: IReqUser) {
  //   try {
  //     return this.authService.generateToken(user);
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
