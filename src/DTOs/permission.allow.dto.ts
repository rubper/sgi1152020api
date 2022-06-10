import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'types/uuid.type';

export class AllowPermissionDTO {
  @ApiProperty({
    description: 'El UUID del usuario a otorgar roles.',
    required: true
  })
  userId: UUID;
  @ApiProperty({
    description: 'El o los UUIDs de los roles a otorgar, puede ser un UUID en string o un arreglo de UUIDs.',
    required: true,
    isArray: true,
  })
  roleIds: UUID | UUID[];
}