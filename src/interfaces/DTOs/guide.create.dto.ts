import { ApiProperty } from '@nestjs/swagger';
import { IGuide } from 'interfaces/guide.interface';
import { UUID } from 'types/uuid.type';

export class CreateGuideDTO implements Partial<IGuide> {
  @ApiProperty({
    description: 'El UUID del usuario asociado al guía.',
    required: true
  })
  user: UUID;
  @ApiProperty({
    description: 'Las horas diarias asignadas al guía.',
    required: true
  })
  fixedHours: number;
  @ApiProperty({
    description: 'El usuario asociado a este guía',
    required: true
  })
  volunteershipStart: string;
  @ApiProperty({
    description: 'Total de horas que el guía ha empleado.',
    required: false
  })
  hoursAggregate: number = 0;
  constructor(userId: UUID, hours: number, start: string, agg?: number) {
    this.user = userId;
    this.fixedHours = hours;
    this.volunteershipStart = start;
    if (agg)
      this.hoursAggregate = agg;
  }
}
