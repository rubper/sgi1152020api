import { BaseEntity, FindConditions, FindManyOptions, FindOneOptions, FindOperator, ObjectID, ObjectType, RemoveOptions, SaveOptions } from 'typeorm';
import { CreateDTO } from './create-dto.type';
import { UpdateDTO } from './update-dto.type';
import { IResource } from 'interfaces/_resource.interface';
import { DbFilterParams } from 'types/_db-filter-params.type';
import { EntityFieldsNames } from 'typeorm/common/EntityFieldsNames';
import { SearchParams } from 'auth/interfaces/_search-params.interface';
import { from, Observable } from 'rxjs';

export type FindCriteria = string | number | Date | ObjectID | FindOneOptions<any> | FindConditions<any>;

export type TypeORMOrder<T = any> = {
  [P in EntityFieldsNames<T>]?: "ASC" | "DESC" | 1 | -1;
};

/**
 * Typeorm Entity that allows to receive an interface and build objects from it
 */
export class BuildableEntity<T extends IResource> extends BaseEntity {
  /**
   * constructor
   * If a baseObject is given, then the class will be constructed with
   * the base object properties
   * 
   * @param baseObject a base object to build the current entity
   */
  constructor(baseObject?: Partial<T> | CreateDTO<T>) {
    // original constructor call
    super();

    // if a base object was given
    if (baseObject) {
      // map base properties in current class
        this.mapValueFromBase(baseObject);
    }
  }

  /**
   * Saves current entity in the database.
   * If entity does not exist in the database then inserts, otherwise updates.
   */
  save$(options?: SaveOptions): Observable<this> {
    return from(this.save(options))
  };
  /**
   * Removes current entity from the database.
   */
  remove$(options?: RemoveOptions): Observable<this> {
    return from(this.remove(options))
  };

  /**
   * Records the delete date of current entity.
   */
  softRemove$(options?: SaveOptions): Observable<this> {
  return from(this.softRemove(options))    
  };
  /**
   * Finds entities that match given options.
   */
  static find$<T extends BaseEntity>(this: BuildableEntity<any>, options?: FindManyOptions<T>): Observable<T[]> {
    return from(BuildableEntity.find<T>(options))
  };
  /**
   * Finds entities that match given find options.
   * Also counts all entities that match given conditions,
   * but ignores pagination settings (from and take options).
   */
  static findAndCount$<T extends BaseEntity>(this: BuildableEntity<any>, options?: FindManyOptions<T>): Observable<[T[], number]> {
    return from(BuildableEntity.findAndCount<T>(options))
  };
  /**
   * Finds entities by ids.
   * Optionally find options can be applied.
   */
  static findByIds$<T extends BaseEntity>(this: BuildableEntity<any>, ids: any[], options?: FindManyOptions<T>): Observable<T[]> {
    return from(BuildableEntity.findByIds<T>(ids, options))
  };
  /**
   * Finds first entity that matches given options.
   */
  static findOne$<T extends BaseEntity>(this: BuildableEntity<any>, findCriteria?: FindCriteria, options?: FindOneOptions<T>): Observable<T | undefined> {
    return from(BuildableEntity.findOne<T>(findCriteria, options))
  };
  /**
   * Finds first entity that matches given options.
   */
  static findOneOrFail$<T extends IResource & BaseEntity>(this: BuildableEntity<T>, id?: FindCriteria, options?: FindOneOptions<T>): Observable<T> {
  return from(BuildableEntity.findOneOrFail<T>(id, options));
};

  /**
   * Maps properties from the given base object, into the current class
   * 
   * @param baseObject - The base object with the properties
   */
  mapValueFromBase(baseObject: Partial<T> | CreateDTO<T> | UpdateDTO<T>): void {
    Object.assign(this, baseObject);
  }

  /**
   * Receives a set, or array of sets of parameters to find a result on the current entity
   *
   * @param filter the filter set, or array of sets to execute the query
   * @returns the entities that matches with the given filters
   */
  static getSearchParams<T extends IResource & BaseEntity>(this: ObjectType<T>, filter: DbFilterParams<T> | DbFilterParams<T>[], order?: TypeORMOrder<T>): SearchParams<T> {
    let findConditions: FindConditions<T> | FindConditions<T>[];
    if (filter instanceof Array) {
      const conditions: FindConditions<T>[] = [];
      filter.forEach(filterParam => {
        const findCondition = BuildableEntity.generateFindConditions<T>(filterParam);
        conditions.push(findCondition)
      });
      findConditions = conditions;
    } else {
      findConditions = BuildableEntity.generateFindConditions<T>(filter);
    }
    return {
      order,
      where: findConditions,
    };
  }

  /**
   * Generates a FindConditions object from a given Filter Params object
   * @param filter the filter params objects with the conditions to filter 
   * @returns a Find Conditions TypeORM object
   */
  static generateFindConditions<T extends IResource>(this: ObjectType<T>, filter: DbFilterParams<T>): FindConditions<T> {
    let findConditions: FindConditions<T> = {};
    Object
      .keys(filter)
      .forEach((key: string) => {
        const typedKey = key as keyof T;
        const filterValue = filter[typedKey].value;
        const filterOperation = filter[typedKey].operator;
        const findByParamOperator: FindOperator<any> = new FindOperator<any>(filterOperation, filterValue );
        findConditions[key] = findByParamOperator;
      });
    return findConditions;
  }
}