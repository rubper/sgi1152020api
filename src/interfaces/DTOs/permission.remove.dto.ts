import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'types/uuid.type';

export class RemovePermissionDTO {
  @ApiProperty({
    description: 'El UUID de la ruta a restringir.',
    required: true
  })
  routeId: UUID;
  @ApiProperty({
    description: 'El o los UUIDs de los roles a los que se les quitara el acceso a la ruta, puede ser un UUID en string o un arreglo de UUIDs.',
    required: true,
    isArray: true,
  })
  roleIds: UUID | UUID[];
}