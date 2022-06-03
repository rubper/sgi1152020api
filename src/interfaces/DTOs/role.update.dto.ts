import { ApiProperty } from '@nestjs/swagger';

import { IRole } from 'auth/interfaces/role.interface';

export class UpdateRoleDTO implements Partial<IRole> {
  @ApiProperty({
    description: 'Nombre unico del rol, no debe contener espacios.',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Nombre del rol legible por humanos. Puede contener espacios.',
    required: false,
  })
  title?: string;
}