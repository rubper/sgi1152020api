
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { CustomLogger } from 'loggers/custom.logger';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as pjson from '../package.json';

// constants forr basic app metadata
export const APP_TITLE = 'SGI-Tin Marin API'; 
export const APP_DESCRIPTION = pjson.description; 
export const APP_VERSION = pjson.version; 

async function bootstrap() {
  // set up nest app
  const app = await NestFactory.create(AppModule, {
    // set up custom logger
    logger: new CustomLogger(),
  });

  // set up Open API docs config
  const config = new DocumentBuilder()
    .setTitle(APP_TITLE)
    .setDescription(APP_DESCRIPTION)
    .setVersion(APP_VERSION)
    .addTag('museo')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // listen app in port 3000
  await app.listen(3000);
}
bootstrap();
