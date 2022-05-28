import { User } from './user.model';
import { UUID } from 'types/uuid.type';

import { ISale } from 'interfaces/sale.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';

export class Sale extends BuildableEntity<ISale> implements ISale {
  uuid: UUID;
  amount: number;
  seller: User;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
