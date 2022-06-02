import { Guide } from './guide.model';
import { UUID } from 'types/uuid.type';
import { TourTypes } from 'constants/tour-types.constant';

import { ITour } from 'interfaces/tour.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';

import { Moment } from 'moment';
import { Column, CreateDateColumn, DeleteDateColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, Entity, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Sale } from './sale.model';

@Entity()
export class Tour extends BuildableEntity<ITour> implements ITour {
  @ApiProperty({
    description: 'Identificador unico autogenerado del registro.',
    required: true
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @ApiProperty({
    description: 'Fecha en que se realizara la visita.',
    required: true
  })
  @Column({type: 'timestamp'})
  date: Moment;

  @ApiProperty({
    description: `Tipo de visita. Valores aceptados: 'excursion' | 'familiar'. `,
    required: true
  })
  @Column({length: 50})
  type: TourTypes;

  @ApiProperty({
    description: 'Estampa autogenerada de fecha que marca la creacion del registro',
    required: false,
    readOnly: true,
  })
  @CreateDateColumn()
  created_at: string;

  @ApiProperty({
    description: 'Estampa autogenerada de fecha que marca la edicion del registro',
    required: false,
    readOnly: true,
  })
  @UpdateDateColumn()
  updated_at: string;

  @ApiProperty({
    description: 'Estampa autogenerada de fecha que marca la eliminacion del registro',
    required: false,
    readOnly: true,
  })
  @DeleteDateColumn()
  deleted_at?: string;

  // relationships
  @ApiProperty({
    description: 'Guia asignado a la visita.',
    required: true
  })
  @ManyToOne(() => Guide, guide => guide.toursHistory)
  guide: Guide;

  @ApiProperty({
    description: 'Ventas que se han producido para esta visita.',
    required: true
  })
  @OneToMany(() => Sale, sale => sale.tour, {nullable: true})
  salesHistory?: Sale[];
}
