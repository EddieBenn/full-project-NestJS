import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IReqUser } from 'src/base.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generateToken = async (user: IReqUser): Promise<string> => {
    const payload = { ...user, sub: user.id }
      const account_token = this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('JWT_SECRET'), //'access token-secretKey',
          issuer: 'APPLE-RENTALS',
          expiresIn: this.configService.get<string>('JWT_EXPIRY'),
      })
  return account_token;
  };

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
