import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Util } from './common/utils/Util';
import { NestExpressApplication } from '@nestjs/platform-express';
import { initUncaughtException } from './infrastructure/server/initUncaughtException';
import { processMigration } from './infrastructure/db_migration/processMigration';
import * as process from 'node:process';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const log = Util.getLog('app');

async function bootstrap() {
  const beginTime = Date.now();

  if (process.env.SKIP_DB_MIGRATION !== 'true') {
    await processMigration();
  } else {
    log.info('skip db migration');
  }

  initUncaughtException();

  const port = process.env.PORT ?? 3000;
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  app.disable('x-powered-by');

  // input validation
  {
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
  }

  // swagger
  {
    const options = new DocumentBuilder()
      .setTitle('P2EX API')
      .setVersion(process.env.VERSION || '')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
        description: 'Enter your Bearer token',
      })
      .build();
    const document = SwaggerModule.createDocument(app, options, {
      operationIdFactory: (controllerKey: string, methodKey: string) => {
        const controllerName = controllerKey
          .replace('Controller', '')
          .toLowerCase();
        return `${controllerName}_${methodKey}`;
      },
    });
    SwaggerModule.setup('docs', app, document, {
      jsonDocumentUrl: 'docs.json',
    });
  }

  // CORS
  {
    app.enableCors({
      origin: (origin, callback) => {
        callback(null, true);
      },
      credentials: true,
      allowedHeaders: [
        'Authorization',
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Referer',
        'Pragma',
        'x-xsrf-token', // some browsers ask about it header too
        'lang',
      ],
      methods: ['OPTIONS', 'HEAD', 'GET', 'PUT', 'POST', 'DELETE'],
      maxAge: 86400,
    });
  }

  await app.listen(port);

  log.info(`Application is running on: ${await app.getUrl()}`);
  log.info(`start time: ${Date.now() - beginTime}ms`);
}

bootstrap().catch(console.error);
