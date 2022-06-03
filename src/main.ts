
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { getProductionFlag } from 'setup';
import { CustomLogger } from 'loggers/custom.logger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { APP_TITLE, APP_DESCRIPTION, APP_VERSION } from 'constants/system.constant';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { loadSecrets } from 'constants/secrets.constant';
export let PRODUCTION: boolean;
// environment variable object
export let ENV: Record<string,string>;

async function bootstrap() {
  // set up app environment
  PRODUCTION = getProductionFlag() || false;

  await loadSecrets();

  // set up nest app
  const app = await NestFactory.create(AppModule, {
    // set up custom logger
    logger: new CustomLogger(),
  });

  const configureBearer: SecuritySchemeObject = {
    type: 'http',
    name: 'bearer',
    bearerFormat: 'JWT',
    scheme: 'bearer'
  };

  // set up Open API docs config
  const swaggerConfig = new DocumentBuilder()
    .setTitle(APP_TITLE)
    .setDescription(APP_DESCRIPTION)
    .setVersion(APP_VERSION)
    .addBearerAuth(
      configureBearer,
    'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // set up cors
  const corsConfig: CorsOptions = {
    origin: '*'
  };
  app.enableCors(corsConfig);
  // listen app in port 3000
  await app.listen(process.env.PORT || 3000, PRODUCTION ? '0.0.0.0' : 'localhost' , () => {});
}

bootstrap();
