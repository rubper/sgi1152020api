import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { RestModule } from './rest/rest.module';

/**
 * Module containing the controllers
 */
@Module({
  imports: [
    RestModule,
    RouterModule.register([
      {
        path: 'rest',
        module: RestModule,
      },
    ]),
  ],
  providers: []
})
export class ControllersModule {}