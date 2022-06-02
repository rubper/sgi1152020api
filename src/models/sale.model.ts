import { User } from './user.model';
import { UUID } from 'types/uuid.type';

import { ISale } from 'interfaces/sale.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';
import { Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tour } from './tour.model';

@Entity()
export class Sale extends BuildableEntity<ISale> implements ISale {
  @ApiProperty({
    description: 'Identificador unico autogenerado del registro.',
    required: true
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;
  
  @ApiProperty({
    description: 'Cantidad total por la que se realizo la venta.',
    required: true
  })
  @Column('decimal')
  amount: number;
  
  @ApiProperty({
    description: 'Estampa autogenerada de fecha que marca la creacion del registro',
    required: false
  })
  @CreateDateColumn()
  created_at: string;
  
  @ApiProperty({
    description: 'Estampa autogenerada de fecha que marca la edicion del registro',
    required: false
  })
  @UpdateDateColumn()
  updated_at: string;
  
  @ApiProperty({
    description: 'Estampa autogenerada de fecha que marca la eliminacion del registro',
    required: false
  })
  @DeleteDateColumn({nullable: true})
  deleted_at?: string;

  @ApiProperty({
    description: 'Primer nombre del titular de la compra.',
    required: true
  })
  ownerFirstName: string;

  @ApiProperty({
    description: 'Primer apellido del titular de la compra.',
    required: true
  })
  ownerLastName: string;

  @ApiProperty({
    description: 'Numero unico de identidad DUI del titular.',
    required: true
  })
  identityDocument: string;

  @ApiProperty({
    description: 'Usuario del titular si existe.',
    required: true
  })
  user?: User;

  @ApiProperty({
    description: 'Visita asignada a los ticket de esta venta.',
    required: true
  })
  tour: Tour;
  
  // relationships
  @ApiProperty({
    description: 'El vendedor asociado a esta compra.',
    required: true
  })
  @ManyToOne(() => User, user => user.sales)
  seller: User;
}
