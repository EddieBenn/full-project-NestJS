import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { LocationCounterModule } from 'src/location-counter/location-counter.module';
import { AgentsModule } from 'src/agents/agents.module';
import { AuthModule } from 'src/auth/auth.module';
import { TwilioModule } from 'src/twilio/twilio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
    ]),
    LocationCounterModule,
    AgentsModule,
    AuthModule,
    TwilioModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
