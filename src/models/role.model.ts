import { User } from './user.model';
import { UUID } from 'types/uuid.type';

import { IRole } from 'auth/interfaces/role.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';
import { Entity, Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role extends BuildableEntity<IRole> implements IRole {
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @Column()
  name: string;

  @Column({nullable: true})
  title?: string;

  // relationships
  @ManyToMany(type => User, user => user.roles)
  users?: User[];
}
