import { ITerm } from './term.interface';

import { Moment } from 'moment';

export interface ITimeable {
  term: ITerm;
  date?: Moment;
}
