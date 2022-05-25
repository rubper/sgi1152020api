import { BaseEntity } from 'typeorm';
import { CreateDTO } from './create-dto.type';
import { UpdateDTO } from './update-dto.type';
import { IResource } from 'interfaces/_resource.interface';
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
}