import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TourService } from 'core/services/tour.service';
import { ITour } from 'interfaces/tour.interface';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UpdateDTO } from 'shared/helpers/base/update-dto.type';

@Controller('tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Post()
  create(@Body() createTourDto: CreateDTO<ITour>) {
    return this.tourService.create(createTourDto);
  }

  @Get()
  findAll() {
    return this.tourService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tourService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTourDto: UpdateDTO<ITour>) {
    return this.tourService.update(id, updateTourDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tourService.remove(id);
  }
}