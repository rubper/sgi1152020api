import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from 'models/user-profile.model';

export class CreateUserDTO {  
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