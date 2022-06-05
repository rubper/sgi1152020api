import { ApiProperty } from '@nestjs/swagger';
import { IUser } from 'auth/interfaces/user.interface';
import { UserProfile } from 'models/user-profile.model';
import { UUID } from 'types/uuid.type';

export class UpdateUserDTO implements Partial<IUser> {  
  @ApiProperty({
    description: 'Nombre de usuario unico',
    required: false
  })
  username?: string;

  @ApiProperty({
    description: 'El UUID del perfil de usuario',
    required: false
  })
  profile?: UUID;
}