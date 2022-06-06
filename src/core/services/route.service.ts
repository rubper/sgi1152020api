import { Injectable } from '@nestjs/common';

import { readdir } from 'fs/promises';
import { Observable, of, from, combineLatest, first, map, switchMap, BehaviorSubject, filter, catchError } from 'rxjs';
import { FindOperator, FindConditions, FindOneOptions, FindManyOptions } from 'typeorm';

import { UUID } from 'types/uuid.type';
import { Role } from 'models/role.model';
import { flatArray } from 'shared/helpers/functions/flat-array.function';
import { Route } from 'models/route.model';
import { difference } from 'lodash';
import { SyncResult } from 'auth/interfaces/sync-result.interface';

export const controllerDirs: string[] = [
  'src/controllers/rest',
  'src/auth/controllers'
]

@Injectable()
export class RouteService {
  private _onSyncRouteTriggered: BehaviorSubject<boolean>;

  constructor() {
    this._onSyncRouteTriggered = new BehaviorSubject<boolean>(false);
  }

  get onSyncRouteTriggered$(): Observable<SyncResult> {
    return this._onSyncRouteTriggered.pipe(
      filter(event => event === true),
      switchMap(() => this.syncRoutes())
    );
  }

  /**
   * Receives the list of controller names that can be assigned roles for the RoleGuard
   * and removes from the db the controller names that aren't anymore in the application,
   * and adds missing controllers in the db
   * @returns 
   */
  syncRoutes(): Observable<SyncResult> {
    const filenamesArray$: Observable<string[]>[] = [];
    controllerDirs.forEach(
      (controllerDir: string) => {
        const filename$ = from(readdir(controllerDir)).pipe(first());
        filenamesArray$.push(filename$);
      }
    )
    return combineLatest(filenamesArray$)
      .pipe(
        first(),
        // flatten array
        map(flatArray),
        // get controllers names & routes saved in db
        switchMap(
          (filenames: string[]) =>  {
            const names = filenames
              .filter(filename => filename.includes('.controller.ts'))
              .map(filteredFile => filteredFile.split('.controller.ts')[0]);
            return combineLatest([
              of(names),
              from(this.findByNames(names))
            ]);
          }
        ),
        // sync controller names with routes
        switchMap(
          ([names, dbRoutes]: [string[], Route[]]) => {
            // where to save results
            let results: Observable<boolean>[] = [];
            // routes stored in db
            const routeNames: string[] = dbRoutes.map(route => route.name);
            // filenames - routes from db = missing filenames in db
            const missingFilenames = difference(names, routeNames);
            // routes in db - filenames = filenames that arent there anymore
            const filenamesToBeDeleted = difference(routeNames, names);
            // sync process
            // insert missing routes
            missingFilenames.forEach(
              (filename: string, index: number) => {
                const isSynced = routeNames.includes(filename.trim());
                if (!isSynced) {
                  const newRoute = Route.create({name: filename});
                  const result = newRoute.save()
                    .then(
                      (route: Route) => true
                    ).catch(
                      (error) => {
                        console.error(error);
                        return false;
                      }
                    );
                  results.push(from(result));
                }
              }
            );
            // remove deleted routes
            filenamesToBeDeleted.forEach(
              (name: string) => {
                const result = this.findByName(name)
                  .then(
                    (role: Role) => {
                      if (!role) {
                        return true;
                      }
                      role.remove();
                      return true;
                    }
                  ).catch(
                    (error) => {
                      console.error(error);
                      return false;
                    }
                  );
                  results.push(from(result));
              }
            );
            // return result checks
            return combineLatest(results);
          }
        ),
        map(
          // get sync result object
          (checks: boolean[]) => {
            console.log(checks);
            const success = checks.every((check: boolean) => check === true);
            const itemsIndex = [];
            checks.forEach(
              (check: boolean, index: number) => {
                if (check === false) {
                  itemsIndex.push(index); 
                }
              } 
            )
            const result: SyncResult = {
              success,
              failedItems: itemsIndex
            }
            return result;
          }
        ),
        catchError(
          (error) => {
            console.error(error);
            return of({
              success: false,
            })
          }
        )
      );
  }

  triggerRouteSync() {
    this._onSyncRouteTriggered.next(true);
  }

  getRouteRoles(uuid: UUID): Observable<Role[]> {
    return from(
      Route.findOne({
        relations:['roles'],
        where: {uuid}
      })
    ).pipe(
      map((route: Route) => route.roles)
    )
  }

  // finds a route by its name
  async findByName(name: string): Promise<Route> {
    const findCondition: FindConditions<Route> = {
      name: new FindOperator<string>('equal', name),
    };
    const findOneOptions: FindOneOptions<Route> = {
      where: findCondition
    };
    return Route.findOne(null, findOneOptions);
  }

  // gets a list of routes from an array of names
  async findByNames(names: string[]): Promise<Route[]> {
    const findConditions: FindConditions<Route>[] = names.map(
      (name: string) =>  ({
        name: new FindOperator<string>('equal', name),
      })
    );
    const findOptions: FindManyOptions<Route> = {
      where: findConditions
    };
    return Route.find(findOptions);
  }

  async update(id: string, updateDto: {name: string}) {
    const route = await Route.findOne(id);
    route.mapValueFromBase(updateDto);
    route.save();
  }

  async remove(id: string) {
    const role = await Role.findOne(id);
    role.softRemove();
  }

  findAll(withDeleted?: boolean) {
    return Route.find({
      withDeleted: withDeleted ? true : false
    });
  }

  findOne(id: string) {
    return Route.findOne(id);
  }

  async getRoleRoutes(roleId: UUID): Promise<Route[]> {
    const role = await Role.findOne({
      relations: ['routes'],
      where: {'uuid': roleId}
    });
    return role?.routes ? role.routes : [];
  }
}