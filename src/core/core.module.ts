import { Global, Module } from '@nestjs/common';
import { GuideService } from './services/guide.service';
import { ReportService } from './services/report.service';
import { RoleService } from './services/role.service';
import { SaleService } from './services/sale.service';
import { TourService } from './services/tour.service';
import { UserProfileService } from './services/user-profile.service';
import { UserService } from './services/user.service';

@Global()
@Module({
  exports: [
    GuideService,
    ReportService,
    RoleService,
    SaleService,
    TourService,
    UserProfileService,
    UserService,
  ],
  providers: [
    GuideService,
    ReportService,
    RoleService,
    SaleService,
    TourService,
    UserProfileService,
    UserService,
  ]
})
export class CoreModule {}
