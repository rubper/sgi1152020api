import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { GuideService } from 'core/services/guide.service';
import { IGuide } from 'interfaces/guide.interface';
import { Guide } from 'models/guide.model';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UpdateDTO } from 'shared/helpers/base/update-dto.type';
import { CreateGuideDTO } from 'interfaces/DTOs/guide-create.dto';
import { UpdateGuideDTO } from 'interfaces/DTOs/guide-update.dto';

@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Post()
  @ApiBody({type: CreateGuideDTO})
  create(@Body() createGuideDto: CreateDTO<Guide>) {
    return this.guideService.create(createGuideDto);
  }

  @Get()
  @ApiResponse({type: Guide, isArray: true})
  findAll() {
    return this.guideService.findAll();
  }

  @Get(':id')
  @ApiResponse({type: Guide})
  findOne(@Param('id') id: string) {
    return this.guideService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({type: UpdateGuideDTO})
  @ApiResponse({type: Guide})
  update(@Param('id') id: string, @Body() updateGuideDto: UpdateDTO<IGuide>) {
    return this.guideService.update(id, updateGuideDto);
  }

  @Delete(':id')
  @ApiResponse({type: null})
  remove(@Param('id') id: string) {
    return this.guideService.remove(id);
  }
}