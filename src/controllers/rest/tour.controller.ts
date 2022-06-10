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

import { Volunteer } from 'models/volunteer.model';
import { TourService } from 'core/services/tour.service';
import { CreateTourDTO } from 'DTOs/tour.create.dto';
import { UpdateTourDTO } from 'DTOs/tour.update.dto';
import { SetRoles } from 'auth/helpers/auth.decorators';
import { RolesGuard } from 'auth/helpers/roles.guard';

@Controller('tour')
@SetRoles()
@UseGuards(RolesGuard)
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Post()
  @ApiBody({ type: CreateTourDTO })
  create(@Body() createTourDto: CreateTourDTO) {
    return this.tourService.create(createTourDto);
  }

  @Get()
  @ApiResponse({ type: Volunteer, isArray: true })
  findAll() {
    return this.tourService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: Volunteer })
  findOne(@Param('id') id: string) {
    return this.tourService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateTourDTO })
  @ApiResponse({ type: Volunteer })
  update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDTO) {
    return this.tourService.update(id, updateTourDto);
  }

  @Delete(':id')
  @ApiResponse({ type: null })
  remove(@Param('id') id: string) {
    return this.tourService.remove(id);
  }
}
