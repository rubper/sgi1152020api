import { TypeORMOrder } from 'shared/helpers/base/buildable.entity';
import { FindConditions } from 'typeorm';

export interface SearchParams<T> {order: TypeORMOrder<T>; where: FindConditions<T> | FindConditions<T>[];}