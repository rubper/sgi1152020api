
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { CustomLogger } from 'loggers/custom.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  await app.listen(3000);
}
bootstrap();
