import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'types/uuid.type';

export class CreateSaleDTO {
  @ApiProperty({
    description: 'Monto total por el que se realizo la venta.',
    required: true,
  })
  total: number;

  @ApiProperty({
    description: 'Primer nombre del titular de la compra.',
    required: true,
  })
  nombreComprador: string;

  @ApiProperty({
    description: 'Primer apellido del titular de la compra.',
    required: true,
  })
  apellidoComprador: string;

  @ApiProperty({
    description: 'El numero de telefono del titular de la compra.',
    required: true,
  })
  telefono: string;

  // relationships
  @ApiProperty({
    description: 'El correo electronico del titular de la compra.',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: 'Cantidad de ninos de la compra.',
    required: true,
  })
  cantidadNinos: number;
  @ApiProperty({
    description: 'Cantidad de adultos de la compra.',
    required: true,
  })
  cantidadAdultos: number;
  @ApiProperty({
    description: 'UUID del usuario del cliente si existe',
    required: false,
  })
  usuarioCliente?: UUID;
  @ApiProperty({
    description: 'UUID del usuario del vendedor',
    required: true,
  })
  usuarioVendedor: UUID;
}
