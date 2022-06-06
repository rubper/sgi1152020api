import { Controller, Get, HttpException, Param, UseGuards } from "@nestjs/common";
import { ApiParam, ApiResponse } from "@nestjs/swagger";
import { SetRoles } from "auth/helpers/auth.decorators";
import { RolesGuard } from "auth/helpers/roles.guard";
import { RouteService } from "core/services/route.service";
import { Role } from "models/role.model";
import { Route } from "models/route.model";
import { isUUIDValid } from "shared/helpers/functions/is-uuid-valid.function";
import { UUID } from "types/uuid.type";

@Controller('route')
@SetRoles()
@UseGuards(RolesGuard)
export class RouteController {
  constructor(private readonly _routeService: RouteService) {}
  
  @Get(':id/roles')
  @ApiParam({
    name: 'id',
    description: 'Requiere el UUID de la ruta'
  })
  @ApiResponse({description: 'Obtiene los roles necesarios para acceder a esta ruta', isArray: true})
  getRoutes(@Param('id') id: UUID) {
    if (!isUUIDValid(id)) {
      throw new HttpException('UUID invalid', 400)
    }
    return this._routeService.getRouteRoles(id);
  }

  @Get()
  @ApiResponse({type: Route, isArray: true})
  findAll() {
    return this._routeService.findAll();
  }

  @Get(':id')
  @ApiResponse({type: Route})
  findOne(@Param('id') id: string) {
    return this._routeService.findOne(id);
  }
}