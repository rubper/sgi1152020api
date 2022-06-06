import { Injectable } from '@nestjs/common';

import { Observable, of, from, combineLatest, map, switchMap, catchError, BehaviorSubject, filter } from 'rxjs';
import { FindOperator, FindConditions, FindOneOptions } from 'typeorm';

import { UUID } from 'types/uuid.type';
import { Role } from 'models/role.model';
import { CreateRoleDTO } from 'interfaces/DTOs/role.create.dto';
import { isUUIDValid } from 'shared/helpers/functions/is-uuid-valid.function';
import { User } from 'models/user.model';
import { Route } from 'models/route.model';
import { RoleService } from './role.service';
import { SyncResult } from 'auth/interfaces/sync-result.interface';

export const DefaultPermissions = {
  admin: {
    role: 'admin',
    routes: [],
    excluded: []
  },
  staff: {
    role: 'staff',
    routes: [],
    excluded: []
  },
}

@Injectable()
export class PermissionService {

  private _onSyncPermissionTriggered: BehaviorSubject<boolean>;
  constructor() {
    this._onSyncPermissionTriggered = new BehaviorSubject<boolean>(false);
  }

  get onSyncPermissionTriggered$() {
    return this._onSyncPermissionTriggered
      .pipe(
        filter((value: boolean) => value === true),
        switchMap(() => this.syncDefaultPermissions())
      )
  }

  syncDefaultPermissions(): Observable<SyncResult> {
    const adminAllowedRoutes$ = from(Route.find({withDeleted: true}));
    const staffAllowedRoutes$ = from(Route.find({withDeleted: false}));
    return combineLatest([
      adminAllowedRoutes$, staffAllowedRoutes$
    ]).pipe(
      switchMap((routes: [Route[], Route[]]) => {
        return combineLatest([
          from(Role.find({
            where: [
              {name: DefaultPermissions.admin.role},
              {name: DefaultPermissions.staff.role}
            ]
          })),
          of(routes)
        ]);
      }),
      switchMap(
        ([roles, routes]: [Role[], [Route[], Route[]]]) => {
          const [adminRoutes, staffRoutes]: [Route[], Route[]] = routes;
          console.log(routes);
          console.log(roles);
          
          const success$: Observable<boolean>[] = [];
          roles.forEach(
            (role: Role) => {
              if (role.name === DefaultPermissions.admin.role) {
                role.routes = adminRoutes;
              } else if (role.name = DefaultPermissions.staff.role) {
                role.routes = staffRoutes;
              } else {}
              const result$ = from(role.save())
                .pipe(
                  map(
                    (role: Role) => {
                      if (!role) {
                        return false;
                      }
                      return true;
                    }
                  ),
                  catchError(
                    (err) => {
                      console.error(err);
                      return of(false);
                    }
                  )
                );
              success$.push(result$);
            }
          );
          return combineLatest(success$);
        }
      ),
      map(
        (checks: boolean[]): SyncResult => {
          const success = checks.every(check => check === true);
          const failed = []; 
          checks.forEach(
            (check: boolean, index: number) => {
              if (!check) {
                failed.push(index);
              }
            }
          )
          return {
            success,
            failedItems: failed
          }
        }
      )
    )
  }

  triggerPermissionSync() {
    this._onSyncPermissionTriggered.next(true);
  }

  /**
   * Assigns permission to a role, to access a route or an array of routes
   * @param roleId 
   * @param routeIds 
   */
  async addPermissionsToRole(roleId: UUID, routeIds: UUID | UUID[]): Promise<Role> {
    const role: Role = await Role.findOne(roleId, {
      relations: ['routes'],
      where: {'uuid': roleId}
    });
    const incomingRoutes: string[] = typeof routeIds === 'string' ? [routeIds] : routeIds; 
    const newRoutes: Route[] = await Route.findByIds(incomingRoutes);
    const alreadyAllowedRoutes: Route[] = role.routes || [];
    newRoutes.forEach(
      (route: Route) => {
        if (!alreadyAllowedRoutes.includes(route)) {
          alreadyAllowedRoutes.push(route)
        }
      }
    );
    role.routes = alreadyAllowedRoutes;
    return role.save();
  }

  
  /**
   * Assigns permission to a role, to access a route or an array of routes
   * @param roleId 
   * @param routeIds 
   */
  async removePermissionsFromRole(roleId: UUID, routeIds: UUID | UUID[]): Promise<Role> {
    const role: Role = await Role.findOne(roleId, {
      relations: ['routes'],
      where: {'uuid': roleId}
    });
    const routesToRemove: string[] = typeof routeIds === 'string' ? [routeIds] : routeIds; 
    const alreadyAllowedRoutes: Route[] = role.routes || [];
    const filteredPermissions = alreadyAllowedRoutes.filter((route: Route) => !routesToRemove.includes(route.uuid));
    role.routes = filteredPermissions;
    return role.save();
  }

  
  async allowRoleToRoute(routeId: UUID, roleIds: UUID | UUID[]): Promise<Role> {
    const route: Route = await Route.findOne(routeId, {
      relations: ['roles'],
      where: {'uuid': routeId}
    });
    const incomingRoles: string[] = typeof roleIds === 'string' ? [roleIds] : roleIds; 
    const newRoles: Role[] = await Role.findByIds(incomingRoles);
    const alreadyRestrictedRoles: Role[] = route.roles || [];
    newRoles.forEach(
      (role: Role) => {
        if (!alreadyRestrictedRoles.includes(role)) {
          alreadyRestrictedRoles.push(role)
        }
      }
    );
    route.roles = alreadyRestrictedRoles;
    return route.save();
  }

  async removeRolePermissionToRoute(routeId: UUID, roleIds: UUID | UUID[]): Promise<Role> {
    const route: Route = await Route.findOne(routeId, {
      relations: ['roles'],
      where: {'uuid': routeId}
    });
    const rolesToRemove: string[] = typeof roleIds === 'string' ? [roleIds] : roleIds; 
    const allreadyAllowedRoles: Role[] = route.roles || [];
    const filteredPermissions = allreadyAllowedRoles.filter((role: Role) => !rolesToRemove.includes(role.uuid));
    route.roles = filteredPermissions;
    return route.save();
  }

  async remove(id: string) {
    const role = await Role.findOne(id);
    role.softRemove();
  }

  async findByName(name: string): Promise<Role> {
    const findByUsernameOperator: FindOperator<string> = new FindOperator<string>('equal', name);
    const findConditions: FindConditions<Role> = {
      name: findByUsernameOperator
    };
    const findOneOptions: FindOneOptions<Role> = {
      where: findConditions
    };
    return Role.findOne(null, findOneOptions);
  }

  create(createDto: CreateRoleDTO) {
    return new Role(createDto).save();
  }

  findRole(role: UUID | string | Role| Observable<Role>): Observable<Role>  {
    let role$: Observable<Role>;
    if (role instanceof Observable) {
      role$ = role;
    } else if (role instanceof Role) {
      role$ = of(role);
    } else if (isUUIDValid(role)) {      
      role$ = from(
        this.findOne(role)
      );
    } else {
      role$ = from(
        this.findByName(role)
      );
    }
    return role$;
  }

  findAll(withDeleted?: boolean) {
    return Role.find({
      withDeleted: withDeleted ? true : false
    });
  }

  findOne(id: string) {
    return Role.findOne(id);
  }

  async getUserRoles(userId: UUID) {
    const user = await User.findOne({
      relations: ['roles'],
      where: {'uuid': userId}
    });
    return user?.roles ? user.roles : [];
  }

}