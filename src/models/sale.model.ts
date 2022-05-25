import { IUser } from 'auth/interfaces/user.interface';
import { ISale } from 'interfaces/sale.interface';
import { UUID } from 'types/uuid.type';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';

export class Sale extends BuildableEntity<ISale> implements ISale {
  amount: number;
  seller: IUser;
  uuid: UUID;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}