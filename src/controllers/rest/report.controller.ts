import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { Guide } from 'models/guide.model';
import { Report } from 'models/report.model';
import { ReportService } from 'core/services/report.service';
import { CreateReportDTO } from 'interfaces/DTOs/report.create.dto';
import { UpdateReportDTO } from 'interfaces/DTOs/report.update.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @ApiBody({type: CreateReportDTO})
  create(@Body() createReportDto: CreateReportDTO) {
    return this.reportService.create(createReportDto);
  }

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