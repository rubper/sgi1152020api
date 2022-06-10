import { Module } from '@nestjs/common';
import { AuthServicesModule } from 'auth/services/auth-services.module';
import { VolunteerController } from './volunteer.controller';
import { PermissionController } from './permission.controller';
import { ReportController } from './report.controller';
import { RoleController } from './role.controller';
import { RouteController } from './route.controller';
import { SaleController } from './sale.controller';
import { TourController } from './tour.controller';
import { UserProfileController } from './user-profile.controller';
import { UserController } from './user.controller';

/**
 * Module containing the rest controllers
 */
@Module({
  imports: [AuthServicesModule],
  controllers: [
    VolunteerController,
    PermissionController,
    ReportController,
    RoleController,
    RouteController,
    SaleController,
    TourController,
    UserProfileController,
    UserController,
  ],
  exports: [
    VolunteerController,
    PermissionController,
    ReportController,
    RoleController,
    RouteController,
    SaleController,
    TourController,
    UserProfileController,
    UserController,
  ],
  providers: [
    VolunteerController,
    PermissionController,
    ReportController,
    RoleController,
    RouteController,
    SaleController,
    TourController,
    UserProfileController,
    UserController,
  ],
})
export class RestModule {}
