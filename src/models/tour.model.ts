import { UUID } from 'types/uuid.type';
import { TourTypes } from 'constants/tour-types.constant';

import { ITour } from 'interfaces/tour.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';

import { Moment } from 'moment';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Tour extends BuildableEntity<ITour> implements ITour {
  @ApiProperty({
    description: 'Identificador unico autogenerado del registro.',
    required: true,
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @ApiProperty({
    description: 'Fecha en que se realizara la visita.',
    required: true,
  })
  @Column({ type: 'timestamp' })
  date: Moment;

  @ApiProperty({
    description: `Tipo de visita. Valores aceptados: 'excursion' | 'familiar'. `,
    required: true,
  })
  @Column({ length: 50 })
  type: TourTypes;

  @ApiProperty({
    description:
      'Estampa autogenerada de fecha que marca la creacion del registro',
    required: false,
    readOnly: true,
  })
  @CreateDateColumn()
  created_at: string;

  @ApiProperty({
    description:
      'Estampa autogenerada de fecha que marca la edicion del registro',
    required: false,
    readOnly: true,
  })
  @UpdateDateColumn()
  updated_at: string;

  @ApiProperty({
    description:
      'Estampa autogenerada de fecha que marca la eliminacion del registro',
    required: false,
    readOnly: true,
  })
  @DeleteDateColumn()
  deleted_at?: string;
}
