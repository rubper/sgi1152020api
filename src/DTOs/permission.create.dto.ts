import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'types/uuid.type';

export class CreatePermissionDTO {
  @ApiProperty({
    description: 'El UUID de la ruta a restringir.',
    required: true
  })
  routeId: UUID;
  @ApiProperty({
    description: 'El o los UUIDs de los roles que tendran acceso a esta ruta, puede ser un UUID en string o un arreglo de UUIDs.',
    required: true,
    isArray: true,
  })
  roleIds: UUID | UUID[];
}