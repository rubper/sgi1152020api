import { BaseEntity, FindConditions, FindOperator, ObjectType } from 'typeorm';
import { CreateDTO } from './create-dto.type';
import { UpdateDTO } from './update-dto.type';
import { IResource } from 'interfaces/_resource.interface';
import { DbFilterParams } from 'types/_db-filter-params.type';
import { EntityFieldsNames } from 'typeorm/common/EntityFieldsNames';

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
  static search<T extends IResource & BaseEntity>(this: ObjectType<T>, filter: DbFilterParams<T> | DbFilterParams<T>[], order?: TypeORMOrder<T>): Promise<T[]> {
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
    return BuildableEntity.find<T>({
      order,
      where: findConditions,
    });
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