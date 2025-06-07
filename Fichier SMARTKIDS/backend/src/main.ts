import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { ClassValidationPipe } from './core/ClassValidation.pipe';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { RedisIoAdapter } from './core/websocketAdapters/Redis-websocket.adapter';
import rawBodyMiddleware from './core/middleware/rawBody.middleware';
import path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // TO be able to inject mongoose connection in my Unique validator.
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(rawBodyMiddleware());
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );
  app.useGlobalPipes(
    new ClassValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('SmartKids API')
    .setDescription('SmartKids API endpoints definitions.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: '*',
  });

  app.useStaticAssets('public');

  /*app.useStaticAssets(path.join(__dirname, '..', 'public'),{
    prefix: '/public/',
  });*/

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(process.env.PORT);
  console.log('Listening on ', await app.getUrl());
}

bootstrap();
