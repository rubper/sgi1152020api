import { Injectable } from '@nestjs/common';
import { APP_TITLE, APP_VERSION } from 'main';

@Injectable()
export class AppService {
  getHello(): string {
    return `${APP_TITLE} v${APP_VERSION} running`;
  }
}
