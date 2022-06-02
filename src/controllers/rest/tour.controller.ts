import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { TourService } from 'core/services/tour.service';
import { UpdateGuideDTO } from 'interfaces/DTOs/guide.update.dto';
import { CreateTourDTO } from 'interfaces/DTOs/tour.create.dto';
import { ITour } from 'interfaces/tour.interface';
import { Guide } from 'models/guide.model';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UpdateDTO } from 'shared/helpers/base/update-dto.type';

@Controller('tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Post()
  @ApiBody({type: CreateTourDTO})
  create(@Body() createTourDto: CreateDTO<ITour>) {
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
  @ApiBody({type: UpdateGuideDTO})
  @ApiResponse({type: Guide})
  update(@Param('id') id: string, @Body() updateTourDto: UpdateDTO<ITour>) {
    return this.tourService.update(id, updateTourDto);
  }

  @Delete(':id')
  @ApiResponse({type: null})
  remove(@Param('id') id: string) {
    return this.tourService.remove(id);
  }
}