import { User } from './user.model';
import { UUID } from 'types/uuid.type';

import { IRole } from 'auth/interfaces/role.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';

export class Role extends BuildableEntity<IRole> implements IRole {
  uuid: UUID;
  name: string;
  title?: string;
  users?: User[];
}
