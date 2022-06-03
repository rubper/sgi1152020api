import { ApiProperty } from '@nestjs/swagger';
import { IRole } from 'auth/interfaces/role.interface';

export class CreateRoleDTO implements Partial<IRole> {
  @ApiProperty({
    description: 'Nombre unico del rol, no debe contener espacios.',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'Nombre del rol legible por humanos. Puede contener espacios.',
    required: false,
  })
  title?: string;
}