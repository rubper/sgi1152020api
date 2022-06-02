import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'types/uuid.type';

export class CreateSaleDTO {  
  @ApiProperty({
    description: 'Cantidad total por la que se realizo la venta.',
    required: true
  })
  amount: number;

  @ApiProperty({
    description: 'Primer nombre del titular de la compra.',
    required: true
  })
  ownerFirstName: string;

  @ApiProperty({
    description: 'Primer apellido del titular de la compra.',
    required: true
  })
  ownerLastName: string;

  @ApiProperty({
    description: 'Numero unico de identidad DUI del titular.',
    required: true
  })
  identityDocument: string;

  @ApiProperty({
    description: 'Visita asignada a los ticket de esta venta.',
    required: true
  })
  tour: UUID;
  
  // relationships
  @ApiProperty({
    description: 'El vendedor asociado a esta compra.',
    required: true
  })
  seller: UUID;

  @ApiProperty({
    description: 'Usuario del titular si existe.',
    required: false
  })
  user?: UUID;
}