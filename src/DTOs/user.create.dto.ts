import { ApiProperty } from '@nestjs/swagger';
import { IUser } from 'auth/interfaces/user.interface';
import { UUID } from 'types/uuid.type';

export class CreateUserDTO implements Partial<IUser> {  
  @ApiProperty({
    description: 'Nombre de usuario unico',
    required: true
  })
  username: string;

  @ApiProperty({
    description: 'El UUID del perfil de usuario',
    required: false
  })
  profile?: UUID;
}