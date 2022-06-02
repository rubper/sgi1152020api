import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'types/uuid.type';

export class UpdateUserProfileDTO {  
  @ApiProperty({
    description: 'Primer nombre del usuario',
    required: false
  })
  firstName?: string;

  @ApiProperty({
    description: 'Primer apellido del usuario',
    required: false
  })
  lastName?: string;

  @ApiProperty({
    description: 'Numero de telefono del usuario opcional',
    required: false
  })
  phone?: string;

  @ApiProperty({
    description: 'Correo electronico del usuario opcional',
    required: false
  })
  email?: string;

  @ApiProperty({
    description: 'Numeros telefonicos extra',
    required: false
  })
  additionalPhonesString?: string;

  // relationships
  @ApiProperty({
    description: 'Usuario asignado a este perfil',
    required: false
  })
  user?: UUID;
}