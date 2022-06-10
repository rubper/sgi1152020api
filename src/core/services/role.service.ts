import { HttpException, Injectable } from '@nestjs/common';

import { Observable, of, from, combineLatest, map, switchMap, catchError, BehaviorSubject, filter } from 'rxjs';
import { FindOperator, FindConditions, FindOneOptions } from 'typeorm';

import { UUID } from 'types/uuid.type';
import { Role } from 'models/role.model';
import { CreateRoleDTO } from 'DTOs/role.create.dto';
import { UpdateRoleDTO } from 'DTOs/role.update.dto';
import { isUUIDValid } from 'shared/helpers/functions/is-uuid-valid.function';
import { User } from 'models/user.model';
import { AuthErrors } from 'auth/helpers/auth.errors';
import { difference } from 'lodash';
import { SyncResult } from 'auth/interfaces/sync-result.interface';
import { Route } from 'models/route.model';

export enum DefaultRoles {
  ADMIN = 'admin', // system admin
  STAFF = 'staff', // business owners
  BASE = 'base' // user with basic access
}

@Injectable()
export class RoleService {

  private _onSyncRoleTriggered: BehaviorSubject<boolean>;
  constructor() {
    this._onSyncRoleTriggered = new BehaviorSubject<boolean>(false);
  }

  get onSyncRoleTriggered$() {
    return this._onSyncRoleTriggered
      .pipe(
        filter((value: boolean) => value === true),
        switchMap(() => this.syncRoles())
      )
  }

  getRoleRoutes(uuid: UUID): Observable<Route[]> {
    return from(
      Role.findOne({
        relations:['routes'],
        where: {uuid}
      })
    ).pipe(
      map((role: Role) => role.routes)
    )
  }

  syncRoles(): Observable<SyncResult> {
    const defaultRoles = Object.values(DefaultRoles);
    // get default roles in db
    return from(this.getRolesByNames(defaultRoles))
      .pipe(
        switchMap((roles: Role[]) => {
          const dbRoles = roles.map(role => role.name);

          // default roles - roles in db = missing default roles in db
          const missingRoles = difference(defaultRoles, dbRoles);
          // roles in db - default roles = roles that arent there anymore
          const rolesToBeDeleted = difference(dbRoles, defaultRoles);
          let success$: Observable<boolean>[] = [];
          missingRoles.forEach(
            (roleToAdd: string) => {
              const newRole = Role.create({name: roleToAdd, title: roleToAdd});
              success$.push(
                from(newRole.save())
                  .pipe(
                    map((role: Role) => {
                      if (!role) {
                        return false;
                      }
                      return true;
                    }),
                    catchError(
                      (error) => {
                        console.error(error);
                        return of(false);
                      }
                    )
                  )
              )
            }
          );
          rolesToBeDeleted.forEach(
            (roleToBeDeleted: string) => {
              success$.push(
                from(Role.findOne({where: {name: roleToBeDeleted}}))
                  .pipe(
                    map((role: Role) => {
                      if (!role) {
                        return true;
                      }
                      return true;
                    }),
                    catchError(
                      (error) => {
                        console.error(error);
                        return of(false);
                      }
                    )
                  )
              )
            }
          )
          return combineLatest(success$);
        }),
        map(
          (success: boolean[]): SyncResult => {
            const isSuccess= success.every((check) => check === true);
            const failed: number[] = [];
            success.forEach((check: boolean, index: number) => {
              if (check !== true) {
                failed.push(index);
              }
            })
            return {
              success: isSuccess,
              failedItems: failed,
            }
          }
        )
      )
  }
  
  triggerRoleSync() {
    this._onSyncRoleTriggered.next(true);
  }

  async addRolesToUser(userId: UUID, roleIds: UUID | UUID[]): Promise<User> {
    const user: User = await User.findOne(userId, {
      relations: ['roles'],
      where: {'uuid': userId}
    });
    const incomingRoles: string[] = typeof roleIds === 'string' ? [roleIds] : roleIds; 
    const newRoles: Role[] = await Role.findByIds(incomingRoles);
    const alreadyObtainedRoles: Role[] = user.roles || [];
    newRoles.forEach(
      (role: Role) => {
        if (!alreadyObtainedRoles.includes(role)) {
          alreadyObtainedRoles.push(role)
        }
      }
    );
    user.roles = alreadyObtainedRoles;
    return user.save();
  }

  async removeRolesFromUser(userId: UUID, roleIds: UUID | UUID[]): Promise<User> {
    const route: User = await User.findOne(userId, {
      relations: ['roles'],
      where: {'uuid': userId}
    });
    const rolesToRemove: string[] = typeof roleIds === 'string' ? [roleIds] : roleIds; 
    const allreadyAllowedRoles: Role[] = route.roles || [];
    const filteredPermissions = allreadyAllowedRoles.filter((role: Role) => !rolesToRemove.includes(role.uuid));
    route.roles = filteredPermissions;
    return route.save();
  }

  getRolesByNames(names: string | string[]): Promise<Role[]> {
    const namesArray: string[] = typeof names === 'string' ? [names] : names;
    return Role.find<Role>({
      where: namesArray.map((role: string) => ({'name': role}))
    });
  }

  async update(id: string, updateDto: UpdateRoleDTO) {
    const defaultRoles = Object.values(DefaultRoles);
    const role = await Role.findOne(id);
    if (defaultRoles.includes(role.name as any)) {
      throw new HttpException(AuthErrors.BASEROLECHANGE_ERROR, 400)
    }
    role.mapValueFromBase(updateDto);
    role.save();
  }

  async remove(id: string) {
    const defaultRoles = Object.values(DefaultRoles);
    const role = await Role.findOne(id);
    if (defaultRoles.includes(role.name as any)) {
      throw new HttpException(AuthErrors.BASEROLECHANGE_ERROR, 400)
    }
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