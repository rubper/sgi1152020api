import { ApiProperty } from '@nestjs/swagger';

import { UUID } from 'types/uuid.type';
import { ITour } from 'interfaces/tour.interface';
import { TourTypes } from 'constants/tour-types.constant';

export class CreateTourDTO implements Partial<ITour> {  

  @ApiProperty({
    description: 'Fecha en que se realizara la visita.',
    required: true
  })
  date: string;

  @ApiProperty({
    description: `Tipo de visita. Valores permitidos: 'excursion' | 'familiar'. `,
    required: true
  })
  type: TourTypes;

  // relationships
  @ApiProperty({
    description: 'El UUID del guia asignado a la visita.',
    required: true
  })
  guide: UUID;
}