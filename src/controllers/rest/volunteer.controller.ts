import { ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { SetRoles } from 'auth/helpers/auth.decorators';
import { RolesGuard } from 'auth/helpers/roles.guard';
import { VolunteerService } from 'core/services/volunteer.service';
import { Volunteer } from 'models/volunteer.model';
import { CreateVolunteerDTO } from 'DTOs/volunteer.create.dto';
import { UpdateVolunteerDTO } from 'DTOs/volunteer.update.dto';
import { IVolunteer } from 'interfaces/volunteer.interface';
import moment from 'moment';

@Controller('Volunteer')
@SetRoles()
@UseGuards(RolesGuard)
export class VolunteerController {
  constructor(private readonly volunteerService: VolunteerService) {}

  @Post()
  @ApiBody({ type: CreateVolunteerDTO })
  create(@Body() createVolunteerDto: CreateVolunteerDTO) {
    const newVolunteer: Partial<IVolunteer> = {
      user: createVolunteerDto.usuario,
      volunteershipStart:
        createVolunteerDto.fechaInicio || moment().toISOString(),
      reason: createVolunteerDto.motivo,
      carreer: createVolunteerDto.carrera,
      email: createVolunteerDto.email,
      previousExperience: createVolunteerDto.experienciaPrevia,
      media: createVolunteerDto.enteradoPor,
      telephone: createVolunteerDto.numeroTelefono,
    };
    return this.volunteerService.create(newVolunteer);
  }

  @Get()
  @ApiResponse({ type: Volunteer, isArray: true })
  findAll() {
    return this.volunteerService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: Volunteer })
  findOne(@Param('id') id: string) {
    return this.volunteerService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateVolunteerDTO })
  @ApiResponse({ type: Volunteer })
  update(
    @Param('id') id: string,
    @Body() updateVolunteerDto: UpdateVolunteerDTO,
  ) {
    const newVolunteer: Partial<IVolunteer> = {};
    if (updateVolunteerDto.carrera) {
      newVolunteer.carreer = updateVolunteerDto.carrera;
    }
    if (updateVolunteerDto.email) {
      newVolunteer.email = updateVolunteerDto.email;
    }
    if (updateVolunteerDto.enteradoPor) {
      newVolunteer.media = updateVolunteerDto.enteradoPor;
    }
    if (updateVolunteerDto.experienciaPrevia) {
      newVolunteer.previousExperience = updateVolunteerDto.experienciaPrevia;
    }
    if (updateVolunteerDto.fechaFin) {
      newVolunteer.volunteershipEnd = updateVolunteerDto.fechaFin;
    }
    if (updateVolunteerDto.fechaInicio) {
      newVolunteer.volunteershipStart = updateVolunteerDto.fechaInicio;
    }
    if (updateVolunteerDto.motivo) {
      newVolunteer.reason = updateVolunteerDto.motivo;
    }
    if (updateVolunteerDto.numeroTelefono) {
      newVolunteer.telephone = updateVolunteerDto.numeroTelefono;
    }
    if (updateVolunteerDto.usuario) {
      newVolunteer.user = updateVolunteerDto.usuario;
    }
    return this.volunteerService.update(id, newVolunteer);
  }

  @Delete(':id')
  @ApiResponse({ type: null })
  remove(@Param('id') id: string) {
    return this.volunteerService.remove(id);
  }
}
