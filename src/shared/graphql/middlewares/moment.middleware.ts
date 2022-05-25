import { MiddlewareContext, NextFn } from '@nestjs/graphql';
import { Moment } from 'moment';

export const momentMiddleware = async (context: MiddlewareContext, next: NextFn<Moment>,) => {
  return (await next()).toISOString();
}