import { FindOperator, FindOperatorType } from 'typeorm';
import { IResource } from '../interfaces/_resource.interface';

export type DbFilter<T> = {
  value: T | FindOperator<T>;
  secondValue?: T;
  operator?: FindOperatorType
};

export type DbFilterParams<T extends IResource> = {
  [P in keyof T]?: DbFilter<T[P]>;
};
