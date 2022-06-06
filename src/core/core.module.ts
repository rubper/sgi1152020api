import { Global, Module } from '@nestjs/common';
import { GuideService } from './services/guide.service';
import { PermissionService } from './services/permission.service';
import { ReportService } from './services/report.service';
import { RoleService } from './services/role.service';
import { RouteService } from './services/route.service';
import { SaleService } from './services/sale.service';
import { TourService } from './services/tour.service';
import { UserProfileService } from './services/user-profile.service';
import { UserSessionService } from './services/user-session.service';
import { UserService } from './services/user.service';

@Global()
@Module({
  exports: [
    GuideService,
    PermissionService,
    ReportService,
    RoleService,
    RouteService,
    SaleService,
    TourService,
    UserProfileService,
    UserSessionService,
    UserService,
  ],
  providers: [
    GuideService,
    PermissionService,
    ReportService,
    RoleService,
    RouteService,
    SaleService,
    TourService,
    UserProfileService,
    UserSessionService,
    UserService,
  ]
})
export class CoreModule {}
