import { SetMetadata } from '@nestjs/common';

export const SetRoles = (...roles: string[]) => {
  return SetMetadata('roles', roles)
};