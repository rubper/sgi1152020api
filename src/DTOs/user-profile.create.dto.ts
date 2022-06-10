import { ApiProperty } from '@nestjs/swagger';

import { UUID } from 'types/uuid.type';
import { IUserProfile } from 'interfaces/user-profile.interface';

export class CreateUserProfileDTO implements Partial<IUserProfile> {  

  @ApiProperty({
    description: 'Primer nombre del usuario',
    required: true
  })
  firstName: string;

  @ApiProperty({
    description: 'Primer apellido del usuario',
    required: true
  })
  lastName: string;

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
    description: 'Numero unico de identidad DUI del titular. Largo de cadena maximo: 10 caracteres.',
    required: true
  })
  identityDocument: string;

  @ApiProperty({
    description: 'Numeros telefonicos extra',
    required: false
  })
  additionalPhonesString?: string;

  // relationships
  @ApiProperty({
    description: 'El UUID del usuario asignado a este perfil',
    required: false
  })
  user: UUID;
}