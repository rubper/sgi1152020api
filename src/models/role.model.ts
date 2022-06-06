import { User } from './user.model';
import { UUID } from 'types/uuid.type';

import { IRole } from 'auth/interfaces/role.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';
import { Entity, Column, ManyToMany, PrimaryGeneratedColumn, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Route } from './route.model';

@Entity()
export class Role extends BuildableEntity<IRole> implements IRole {
  @ApiProperty({
    description: 'Identificador unico autogenerado del registro',
    required: false,
    readOnly: true,
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @ApiProperty({
    description: 'Nombre unico del rol',
    required: false,
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Nombre del rol legible por humanos',
    required: false,
  })
  @Column({nullable: true})
  title?: string;

  // relationships
  @ApiProperty({
    description: 'Usuarios que poseen este rol',
    required: false,
  })
  @ManyToMany(type => User, user => user.roles, {nullable: true}) 
  @JoinTable()
  users?: User[];
  @ApiProperty({
    description: 'Usuarios que poseen este rol',
    required: false,
  })
  @ManyToMany(type => Route, route => route.roles, {nullable: true}) 
  @JoinTable()
  routes?: Route[];
}
