import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { GqlModuleOptions } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';

import { join } from 'path';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { ResolversModule } from './resolvers/resolvers.module';

import { ControllersModule } from 'controllers/controllers.module';
import { AuthControllersModule } from 'auth/controllers/auth-controllers.module';
import { RouteService } from 'core/services/route.service';
import { SyncResult } from 'auth/interfaces/sync-result.interface';
import { Subscription } from 'rxjs';
import { RoleService } from 'core/services/role.service';
import { PermissionService } from 'core/services/permission.service';

export const graphQlModuleOptions: GqlModuleOptions = {
  driver: ApolloDriver,
  include: [ResolversModule],
  autoSchemaFile: join(process.cwd(), 'src/shared/graphql/schema.gql'),
  sortSchema: true,
};

@Module({
  imports: [
    CoreModule, 
    SharedModule,
    ResolversModule,
    ControllersModule,
    AuthControllersModule,
    // GraphQLModule.forRoot<ApolloDriverConfig>(graphQlModuleOptions),
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
  private _roleSyncSubscription: Subscription;
  private _routeSyncSubscription: Subscription;
  private _permissionSyncSubscription: Subscription;
  constructor(
    private _roleService: RoleService,
    private _routeService: RouteService,
    private _permissionService: PermissionService,
  ) { }

  onModuleInit() {
    // init sync
    this._roleService.triggerRoleSync();
    this._routeService.triggerRouteSync();
    this._permissionService.triggerPermissionSync();
    this._routeSyncSubscription = this._routeService
      .onSyncRouteTriggered$
      .subscribe({
        next: (result: SyncResult) => {
          if (!result.success) {
            console.log(result.failedItems);            
            throw new Error('Error trying to sync routes');
          }
          return true;
        },
        error: (error) => console.error(error)
      });
    this._roleSyncSubscription = this._roleService
      .onSyncRoleTriggered$
      .subscribe({
        next: (result: SyncResult) => {
          if (!result.success) {
            console.log(result.failedItems);            
            throw new Error('Error trying to sync roles');
          }
          return true;
        },
        error: (error) => console.error(error)
      });
      this._permissionSyncSubscription = this._permissionService
        .onSyncPermissionTriggered$
        .subscribe({
          next: (result: SyncResult) => {
            if (!result.success) {
              console.log(result.failedItems);            
              throw new Error('Error trying to sync roles');
            }
            return true;
          },
          error: (error) => console.error(error)
        });
  }

  onModuleDestroy() {
    this._roleSyncSubscription.unsubscribe();
    this._routeSyncSubscription.unsubscribe();
    this._permissionSyncSubscription.unsubscribe();
  }
}
