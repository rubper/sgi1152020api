import { ApiProperty } from '@nestjs/swagger';
import { IUser } from 'auth/interfaces/user.interface';
import { UserProfile } from 'models/user-profile.model';

export class CreateUserDTO implements Partial<IUser> {  
  @ApiProperty({
    description: 'Nombre de usuario unico',
    required: true
  })
  username: string;

  @ApiProperty({
    description: 'Perfil de usuario',
    required: false
  })
  profile?: UserProfile;
}