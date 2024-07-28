import { Module } from '@nestjs/common';
import { LocationCounterService } from './location-counter.service';
import { LocationCounterController } from './location-counter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationCounter } from './entities/location-counter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LocationCounter,
    ])
  ],
  controllers: [LocationCounterController],
  providers: [LocationCounterService],
  exports: [LocationCounterService],
})
export class LocationCounterModule {}
