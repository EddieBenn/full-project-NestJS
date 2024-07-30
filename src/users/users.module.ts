import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { LocationCounterModule } from 'src/location-counter/location-counter.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
    ]),
    LocationCounterModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
