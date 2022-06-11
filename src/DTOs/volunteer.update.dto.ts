import { ApiProperty } from '@nestjs/swagger';
import { EnrollmentReason } from 'constants/enrollment-reason.constant';
import { UUID } from 'types/uuid.type';

export class UpdateVolunteerDTO {
  @ApiProperty({
    description: 'El usuario asociado a este voluntario.',
    required: true,
  })
  usuario?: UUID;
  @ApiProperty({
    description: 'La fecha de inicio del voluntario en el museo.',
    required: false,
  })
  fechaInicio?: string;
  @ApiProperty({
    description: 'La fecha de fin del voluntario en el museo.',
    required: false,
  })
  fechaFin?: string;
  @ApiProperty({
    description: 'La carrera cursada actualmente por el solicitante.',
    required: false,
  })
  carrera?: string;
  @ApiProperty({
    description: 'El numero de telefono del solicitante.',
    required: false,
  })
  numeroTelefono?: string;
  @ApiProperty({
    description: 'El correo electronico del solicitante.',
    required: false,
  })
  email?: string;
  @ApiProperty({
    description:
      'Otras organizaciones en las que el solicitante ha sido voluntario.',
    required: false,
  })
  experienciaPrevia?: string;
  @ApiProperty({
    description:
      'Medio por el que se entero el voluntario o voluntaria, del programa.',
    required: false,
  })
  enteradoPor?: string;
  @ApiProperty({
    description: 'Motivo por el cual el voluntario entro al programa.',
    required: false,
  })
  motivo?: EnrollmentReason;
}
