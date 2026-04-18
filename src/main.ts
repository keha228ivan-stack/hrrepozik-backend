import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggerService } from './common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);
  const logger = app.get(LoggerService);

  app.useLogger(logger);
  app.setGlobalPrefix(config.get<string>('API_PREFIX', 'api'));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  const corsOrigins = (config.get<string>('CORS_ORIGINS', '') || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({ origin: corsOrigins.length > 0 ? corsOrigins : true, credentials: true });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('HRRepozik Unified API')
    .setDescription('Shared backend API for web + desktop clients')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = config.get<number>('PORT', 4000);
  await app.listen(port);
  logger.log(`Server started on port ${port}`);
}

bootstrap();
