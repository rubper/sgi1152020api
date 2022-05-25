import { UUID } from 'types/uuid.type';
import { IRole } from 'auth/interfaces/role.interface';
import { IUser } from 'auth/interfaces/user.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';

export class User extends BuildableEntity<IUser> implements IUser {
  uuid: UUID;
  username: string;
  passwordHash: string;
  passwordSalt: string;
  secretHash?: string;
  roles?: IRole[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}