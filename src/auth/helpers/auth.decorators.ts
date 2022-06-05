import { SetMetadata } from '@nestjs/common';
export const ROLES_METAKEY = 'roles';
export const SetRoles = (...roles: string[]) => SetMetadata(ROLES_METAKEY, roles);