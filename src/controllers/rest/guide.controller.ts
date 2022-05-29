import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GuideService } from 'core/services/guide.service';
import { IGuide } from 'interfaces/guide.interface';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UpdateDTO } from 'shared/helpers/base/update-dto.type';

@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Post()
  create(@Body() createGuideDto: CreateDTO<IGuide>) {
    return this.guideService.create(createGuideDto);
  }

  @Get()
  findAll() {
    return this.guideService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guideService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGuideDto: UpdateDTO<IGuide>) {
    return this.guideService.update(id, updateGuideDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guideService.remove(id);
  }
}