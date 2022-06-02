import { ApiProperty } from '@nestjs/swagger';
import { TourTypes } from 'constants/tour-types.constant';
import { UUID } from 'types/uuid.type';

export class CreateTourDTO {  

  @ApiProperty({
    description: 'Fecha en que se realizara la visita.',
    required: true
  })
  date: string;

  @ApiProperty({
    description: `Tipo de visita. Valores aceptados: 'excursion' | 'familiar'. `,
    required: true
  })
  type: TourTypes;

  // relationships
  @ApiProperty({
    description: 'Guia asignado a la visita.',
    required: true
  })
  guide: UUID;
}