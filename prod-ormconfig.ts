import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
const {
  PROD_PORT,
  PROD_DB_NAME,
  PROD_DB_HOST,
  PROD_DB_PASSWORD,
  PROD_DB_USERNAME,
  PROD_DB_SCHEMA
} = process.env;

const config = {
  type: 'postgres',
  host: PROD_DB_HOST!,
  port: Number(PROD_PORT),
  username: PROD_DB_USERNAME!,
  password: PROD_DB_PASSWORD!,
  database: PROD_DB_NAME!,
  schema: PROD_DB_SCHEMA!,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
  migrations: ['dist/src/migrations/*{.ts,.js}'],
  // migrationsRun: true,
  // autoLoadEntities: true,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
