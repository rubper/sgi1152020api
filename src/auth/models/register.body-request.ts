import { ApiProperty } from '@nestjs/swagger';
import { RegisterRequest } from 'auth/interfaces/_register-request.interface';

export class RegisterBody implements RegisterRequest {
  @ApiProperty({
    description: 'Nombre de usuario unico',
    required: true
  })
  username: string;
  @ApiProperty({
    description: 'Constraseña del usuario',
    required: true
  })
  password: string;
  @ApiProperty({
    description: 'Confirmacion de contraseña',
    required: true
  })
  passwordConfirmation: string;
}