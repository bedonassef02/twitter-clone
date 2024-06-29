import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { SwaggerModule } from '@nestjs/swagger';
import { options } from './utils/helpers/swagger.helper';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.enableVersioning();
  app.enableCors();
  app.use(cookieParser());
  app.use(helmet());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const port: number = parseInt(process.env.APP_PORT, 10) || 3000;

  await app.listen(port);
}

bootstrap();
