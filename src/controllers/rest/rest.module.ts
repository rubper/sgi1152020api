import { Module } from '@nestjs/common';
import { AuthServicesModule } from 'auth/services/auth-services.module';
import { GuideController } from './guide.controller';
import { ReportController } from './report.controller';
import { RoleController } from './role.controller';
import { SaleController } from './sale.controller';
import { TourController } from './tour.controller';
import { UserProfileController } from './user-profile.controller';
import { UserController } from './user.controller';

/**
 * Module containing the rest controllers
 */
@Module({
  imports: [
    AuthServicesModule,
  ],
  controllers: [
    GuideController,
    ReportController,
    RoleController,
    SaleController,
    TourController,
    UserProfileController,
    UserController,
  ],
  exports: [
    GuideController,
    ReportController,
    RoleController,
    SaleController,
    TourController,
    UserProfileController,
    UserController,
  ],
  providers: [
    GuideController,
    ReportController,
    RoleController,
    SaleController,
    TourController,
    UserProfileController,
    UserController,
  ],
})
export class RestModule {}