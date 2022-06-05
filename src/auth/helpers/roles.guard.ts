import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { UserService } from 'core/services/user.service';
import { SecurityService } from 'auth/services/security.service';
import { Role } from 'models/role.model';
import { ROLES_METAKEY } from './auth.decorators';
import { Reflector } from '@nestjs/core';
import { AuthErrors } from './auth.errors';
import { RoleService } from 'core/services/role.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private _reflector: Reflector,
    private _roleService: RoleService,
    private _securityService: SecurityService,
  ) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // check if there are roles protecting this route
    const routeRoles = this._reflector.get<string[]>(ROLES_METAKEY, context.getClass());
    if(!routeRoles || routeRoles.length === 0) {
      return true;
    }

    // check if there's an authentication header
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    
    if (!authHeader) {
      throw new HttpException(AuthErrors.AUTHREQUIRED_ERROR, 401);
    }

    //obtain user roles from access token
    const token = authHeader.split('Bearer ')[1].trim();
    const userId =  this._securityService.getUserIdFromToken(token);
    const roles = await this._roleService.getUserRoles(userId);
    const userRoles: string[] = roles.map((role: Role) => role.name);

    // check if the user has the roles to access the content
    return this._checkMatchingRoles(routeRoles, userRoles);
  }

  private _checkMatchingRoles(routeRoles: string[], userRoles: string[]) {
    return routeRoles.every((routeRole: string) => userRoles.includes(routeRole));
  }
}