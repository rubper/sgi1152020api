
import { Role } from './role.model';
import { UUID } from 'types/uuid.type';
import { IRoute } from 'interfaces/route.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Route extends BuildableEntity<IRoute> implements IRoute {
  @ApiProperty({
    description: 'Identificador unico autogenerado del registro',
    required: false,
    readOnly: true,
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;
  @ApiProperty({
    description: 'Nombre de la ruta.',
    required: false,
    readOnly: true,
  })
  @Column()
  name: string;
  @ApiProperty({
    description: 'Roles necesarios para acceder a esta ruta.',
    required: false
  })
  @ManyToMany(() => Role, role => role.routes, {nullable: true})
  @JoinTable()
  roles?: Role[];
}
