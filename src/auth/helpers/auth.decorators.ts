import { SetMetadata } from '@nestjs/common';
export const ROLES_METAKEY = 'roles';
export const CONTROLLERID_METAKEY = 'controllerid';
export const SetRoles = (...roles: string[]) => SetMetadata(ROLES_METAKEY, roles);
export const AuthRoute = (identifier: string) => SetMetadata(CONTROLLERID_METAKEY, identifier);