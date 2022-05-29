
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as pjson from '../package.json';
import { AppModule } from './app.module';
import { getProductionFlag, setupEnvironment } from 'setup';
import { CustomLogger } from 'loggers/custom.logger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

// constants for basic app metadata
export const APP_TITLE: string = 'SGI-Tin Marin API'; 
export const APP_DESCRIPTION: string = pjson.description; 
export const APP_VERSION: string = pjson.version;
export let PRODUCTION: boolean;
// environment variable object
export let ENV: Record<string,string>;

async function bootstrap() {
  // set up app environment
  PRODUCTION = getProductionFlag() || false;
  ENV = await setupEnvironment(PRODUCTION);

  // set up nest app
  const app = await NestFactory.create(AppModule, {
    // set up custom logger
    logger: new CustomLogger(),
  });

  // set up Open API docs config
  const swaggerConfig = new DocumentBuilder()
    .setTitle(APP_TITLE)
    .setDescription(APP_DESCRIPTION)
    .setVersion(APP_VERSION)
    .addTag('museo')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // set up cors
  const corsConfig: CorsOptions = {
    origin: '*'
  };
  app.enableCors(corsConfig);
  // listen app in port 3000
  await app.listen(3000);
}

bootstrap();
