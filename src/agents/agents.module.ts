import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationCounterModule } from 'src/location-counter/location-counter.module';
import { Agents } from './entities/agent.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Agents,
    ]),
    LocationCounterModule,
  ],
  controllers: [AgentsController],
  providers: [AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}
