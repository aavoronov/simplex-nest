import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getBotToken } from 'nestjs-telegraf';
import { AllExceptionsFilter } from './http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { SocketIOAdapter } from './socket-io-adapter';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    cors: true,
  });
  const configService = app.get(ConfigService);
  // const bot = app.get(getBotToken());
  // app.use(bot.webhookCallback('/secret-path'));
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }));
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));

  // app.useWebSocketAdapter(new IoAdapter(app));

  const config = new DocumentBuilder()
    .setTitle('test')
    .setDescription(`The API description`)
    .setVersion('1.0s')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);
  await app.listen(5000);
}
bootstrap();
