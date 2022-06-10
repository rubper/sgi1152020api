import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleDTO {  
  @ApiProperty({
    description: 'Monto total por el que se realizo la venta.',
    required: true
  })
  total: number;

  @ApiProperty({
    description: 'Cantidad total por la que se realizo la venta.',
    required: true
  })
  cantidadEntradas: number;

  @ApiProperty({
    description: 'Primer nombre del titular de la compra.',
    required: true
  })
  nombreComprador: string;

  @ApiProperty({
    description: 'Primer apellido del titular de la compra.',
    required: true
  })
  apellidoComprador: string;

  @ApiProperty({
    description: 'El numero de telefono del titular de la compra.',
    required: true
  })
  telefono: string;
  
  // relationships
  @ApiProperty({
    description: 'El correo electronico del titular de la compra.',
    required: true
  })
  email: string;

  @ApiProperty({
    description: 'Cantidad de ninos de la compra.',
    required: false
  })
  cantidadNinos: number;
  @ApiProperty({
    description: 'Cantidad de adultos de la compra.',
    required: false
  })
  cantidadAdultos: number;
}