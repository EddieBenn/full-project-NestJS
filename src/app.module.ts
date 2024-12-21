import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationCounterModule } from './location-counter/location-counter.module';
import { UsersModule } from './users/users.module';
import { AgentsModule } from './agents/agents.module';
import { AuthModule } from './auth/auth.module';
import typeorm from '../prod-ormconfig';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AdminModule } from './admin/admin.module';
import { initializeDataSource } from './datasource';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        try {
          const options: DataSourceOptions =
            configService.get<DataSourceOptions>('typeorm');
          if (!options) {
            throw new Error('Invalid options passed');
          }
          const dataSource = await initializeDataSource(options);
          addTransactionalDataSource(dataSource);
          return dataSource.options;
        } catch (error) {
          console.error('Error connecting to the database:', error);
          throw error;
        }
      },
    }),
    LocationCounterModule,
    UsersModule,
    AgentsModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
