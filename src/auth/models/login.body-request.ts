import { ApiProperty } from '@nestjs/swagger';
import { LoginRequest } from 'auth/interfaces/_login-request.interface';

export class LoginBody implements LoginRequest {
  @ApiProperty({
    description: 'Nombre de usuario para inicio de sesion',
    required: true
  })
  username: string;
  @ApiProperty({
    description: 'Contraseña del usuario',
    required: true
  })
  password: string;
}