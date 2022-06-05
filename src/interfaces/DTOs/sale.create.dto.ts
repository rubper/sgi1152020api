import { ApiProperty } from '@nestjs/swagger';

import { UUID } from 'types/uuid.type';
import { ISale } from 'interfaces/sale.interface';

export class CreateSaleDTO implements Partial<ISale> {  
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
    description: 'El UUID de la visita asignada a los ticket de esta venta.',
    required: true
  })
  tour: UUID;
  
  // relationships
  @ApiProperty({
    description: 'El UUID del vendedor asociado a esta compra.',
    required: true
  })
  seller: UUID;

  @ApiProperty({
    description: 'El UUID del usuario del titular si existe.',
    required: false
  })
  user?: UUID;
}