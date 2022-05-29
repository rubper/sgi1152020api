import { Module } from '@nestjs/common';
import { AuthServicesModule } from 'auth/services/auth-services.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    AuthServicesModule
  ],
  providers: [
    AuthController
  ],
  controllers: [
    AuthController
  ],
  exports: [
    AuthController
  ]
})
export class AuthControllersModule {}
