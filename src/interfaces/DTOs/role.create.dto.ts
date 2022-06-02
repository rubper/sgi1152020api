import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDTO {
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