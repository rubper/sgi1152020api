import { ApiProperty } from '@nestjs/swagger';

import { UUID } from 'types/uuid.type';
import { ITour } from 'interfaces/tour.interface';
import { TourTypes } from 'constants/tour-types.constant';

export class UpdateTourDTO implements Partial<ITour> {  

  @ApiProperty({
    description: 'Fecha en que se realizara la visita.',
    required: false
  })
  date?: string;

  @ApiProperty({
    description: `Tipo de visita. Valores aceptados: 'excursion' | 'familiar'. `,
    required: false
  })
  type?: TourTypes;

  // relationships
  @ApiProperty({
    description: 'Guia asignado a la visita.',
    required: false
  })
  guide?: UUID;
}