import { ApiProperty } from '@nestjs/swagger';
import { IGuide } from 'interfaces/guide.interface';
import { UUID } from 'types/uuid.type';

export class UpdateGuideDTO implements Partial<IGuide> {
  @ApiProperty({
    description: 'El UUID del usuario asociado al guía.',
    required: true
  })
  user?: UUID;
  @ApiProperty({
    description: 'Las horas diarias asignadas al guía.',
    required: false
  })
  fixedHours?: number;
  @ApiProperty({
    description: 'Estampa de fecha que marca el inicio del voluntariado',
    required: false
  })
  volunteershipStart?: string;
  @ApiProperty({
    description: 'El Estampa de fecha que marca el fin del voluntariado',
    required: false
  })
  volunteershipEnd?: string;
  @ApiProperty({
    description: 'Total de horas que el guía ha empleado.',
    required: false
  })
  hoursAggregate?: number = 0;
  @ApiProperty({
    description: 'Arreglo de UUIDs de visitas asociadas al guia.',
    required: false
  })
  toursHistory?: UUID[];
  constructor(userId: UUID, hours: number, start: string, agg?: number) {
    this.user = userId;
    this.fixedHours = hours;
    this.volunteershipStart = start;
    if (agg)
      this.hoursAggregate = agg;
  }
}
