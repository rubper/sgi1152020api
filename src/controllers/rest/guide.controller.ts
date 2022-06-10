import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { Guide } from 'models/guide.model';
import { GuideService } from 'core/services/guide.service';
import { CreateGuideDTO } from 'DTOs/guide.create.dto';
import { UpdateGuideDTO } from 'DTOs/guide.update.dto';
import { SetRoles } from 'auth/helpers/auth.decorators';
import { AuthGuard } from 'auth/helpers/auth.guard';
import { RolesGuard } from 'auth/helpers/roles.guard';

@Controller('guide')
@SetRoles()
@UseGuards(RolesGuard)
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Post()
  @ApiBody({type: CreateGuideDTO})
  create(@Body() createGuideDto: CreateGuideDTO) {
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
  update(@Param('id') id: string, @Body() updateGuideDto: UpdateGuideDTO) {
    return this.guideService.update(id, updateGuideDto);
  }

  @Delete(':id')
  @ApiResponse({type: null})
  remove(@Param('id') id: string) {
    return this.guideService.remove(id);
  }
}