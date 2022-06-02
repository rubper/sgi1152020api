import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from 'models/user-profile.model';

export class UpdatUserDTO {  
  @ApiProperty({
    description: 'Nombre de usuario unico',
    required: false
  })
  username?: string;

  @ApiProperty({
    description: 'Perfil de usuario',
    required: false
  })
  profile?: UserProfile;
}