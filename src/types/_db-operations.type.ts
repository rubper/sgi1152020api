import { IResource } from 'interfaces/_resource.interface';
import { FindOperatorType } from 'typeorm';
import { DbQueryParams } from './_db-queryparams.type';

export type DbOperations<T extends IResource> = Partial<Record<DbQueryParams<T>, FindOperatorType>>;