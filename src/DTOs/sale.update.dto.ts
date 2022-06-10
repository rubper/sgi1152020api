import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'types/uuid.type';

export class UpdateSaleDTO {
  @ApiProperty({
    description: 'Monto total por el que se realizo la venta.',
    required: true,
  })
  total?: number;

  @ApiProperty({
    description: 'Primer nombre del titular de la compra.',
    required: true,
  })
  nombreComprador?: string;

  @ApiProperty({
    description: 'Primer apellido del titular de la compra.',
    required: true,
  })
  apellidoComprador?: string;

  @ApiProperty({
    description: 'El numero de telefono del titular de la compra.',
    required: true,
  })
  telefono?: string;

  @ApiProperty({
    description: 'El correo electronico del titular de la compra.',
    required: true,
  })
  email?: string;

  @ApiProperty({
    description: 'Cantidad de ninos de la compra.',
    required: false,
  })
  cantidadNinos?: number;
  @ApiProperty({
    description: 'Cantidad de adultos de la compra.',
    required: false,
  })
  cantidadAdultos?: number;
  @ApiProperty({
    description: 'UUID del usuario del vendedor',
    required: true,
  })
  usuarioVendedor: UUID;
}
