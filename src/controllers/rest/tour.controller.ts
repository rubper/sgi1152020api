import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { Guide } from 'models/guide.model';
import { TourService } from 'core/services/tour.service';
import { CreateTourDTO } from 'interfaces/DTOs/tour.create.dto';
import { UpdateTourDTO } from 'interfaces/DTOs/tour.update.dto';

@Controller('tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Post()
  @ApiBody({type: CreateTourDTO})
  create(@Body() createTourDto: CreateTourDTO) {
    return this.tourService.create(createTourDto);
  }

  @Get()
  @ApiResponse({type: Guide, isArray: true})
  findAll() {
    return this.tourService.findAll();
  }

  @Get(':id')
  @ApiResponse({type: Guide})
  findOne(@Param('id') id: string) {
    return this.tourService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({type: UpdateTourDTO})
  @ApiResponse({type: Guide})
  update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDTO) {
    return this.tourService.update(id, updateTourDto);
  }

  @Delete(':id')
  @ApiResponse({type: null})
  remove(@Param('id') id: string) {
    return this.tourService.remove(id);
  }
}