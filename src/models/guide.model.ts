import { Tour } from './tour.model';
import { User } from './user.model';
import { UUID } from 'types/uuid.type';

import { IGuide } from 'interfaces/guide.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';

import { Moment } from 'moment';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Guide extends BuildableEntity<IGuide> implements IGuide {
  @ApiProperty({
    description: 'Identificador unico autogenerado del registro',
    required: false,
    readOnly: true,
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;
  
  @ApiProperty({
    description: 'Las horas diarias asignadas al guía.',
    required: true
  })
  @Column({ type: 'decimal', default: 0 })
  fixedHours: number;
  
  @ApiProperty({
    description: 'Total de horas que el guía ha empleado.',
    required: false
  })
  @Column({ type: 'decimal', default: 0 })
  hoursAggregate: number;
  
  @ApiProperty({
    description: 'Estampa de fecha que marca el inicio del voluntariado' +
    'Debe proveerse en formato estándar ISO 8601 (ISO String).',
    required: true
  })
  @Column({type: 'timestamp'})
  volunteershipStart: Moment;
  
  @ApiProperty({
    description: 'Estampa de fecha que marca el fin del voluntariado' +
    'Debe proveerse en formato estándar ISO 8601 (ISO String).',
    required: false
  })
  @Column({type: 'timestamp', nullable: true})
  volunteershipEnd?: Moment;
  
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
  @DeleteDateColumn({nullable: true})
  deleted_at?: string;
  
  // relationships
  @ApiProperty({
    description: 'El usuario asociado al guía.',
    required: true
  })
  @OneToOne(() => User, user => user.guide)
  @JoinColumn()
  user: User;
  
  @ApiProperty({
    description: 'Arreglo de visitas asociadas al guia.',
    required: false,
    isArray: true
  })
  @OneToMany(() => Tour, tour => tour.guide, {nullable: true})
  toursHistory?: Tour[];
}
