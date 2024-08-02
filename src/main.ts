import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from './filters/exception-filter';
import { ConfigService } from '@nestjs/config';
import { initializeTransactionalContext } from 'typeorm-transactional';
import {
  ExpressAdapter,
  type NestExpressApplication,
} from '@nestjs/platform-express';
import rateLimit from 'express-rate-limit';
import * as cookieParser from 'cookie-parser';

async function bootstrap(): Promise<NestExpressApplication> {
  initializeTransactionalContext();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );
  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);

  const PORT = +configService.get('PORT') || 3050;

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per 15 mintutes
    }),
  );
  app.use(cookieParser());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter(reflector));

  await app.listen(PORT, () => {
    console.log(`server running on port:: ${PORT}`);
  });

  return app;
}
void bootstrap();
