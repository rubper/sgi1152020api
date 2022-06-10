import { ApiBody, ApiExcludeController, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { Guide } from 'models/guide.model';
import { Report } from 'models/report.model';
import { ReportService } from 'core/services/report.service';
import { CreateReportDTO } from 'DTOs/report.create.dto';
import { UpdateReportDTO } from 'DTOs/report.update.dto';
import { SetRoles } from 'auth/helpers/auth.decorators';
import { AuthGuard } from 'auth/helpers/auth.guard';
import { RolesGuard } from 'auth/helpers/roles.guard';

@Controller('report')
@ApiExcludeController()
@SetRoles()
@UseGuards(RolesGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @ApiBody({type: CreateReportDTO})
  create(@Body() createReportDto: CreateReportDTO) {
    return this.reportService.create(createReportDto);
  }
c
  @Get()
  @ApiResponse({type: Guide, isArray: true})
  findAll() {
    return this.reportService.findAll();
  }

  @Get(':id')
  @ApiResponse({type: Report})
  findOne(@Param('id') id: string) {
    return this.reportService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({type: UpdateReportDTO})
  @ApiResponse({type: Report})
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDTO) {
    return this.reportService.update(id, updateReportDto);
  }

  @Delete(':id')
  @ApiResponse({type: null})
  remove(@Param('id') id: string) {
    return this.reportService.remove(id);
  }
}