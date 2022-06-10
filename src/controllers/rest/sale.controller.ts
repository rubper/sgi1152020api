import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { Sale } from 'models/sale.model';
import { SaleService } from 'core/services/sale.service';
import { CreateSaleDTO } from 'DTOs/sale.create.dto';
import { UpdateSaleDTO } from 'DTOs/sale.update.dto';
import { SetRoles } from 'auth/helpers/auth.decorators';
import { AuthGuard } from 'auth/helpers/auth.guard';
import { RolesGuard } from 'auth/helpers/roles.guard';

@Controller('sale')
@SetRoles()
@UseGuards(RolesGuard)
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  @ApiBody({type: CreateSaleDTO})
  create(@Body() createSaleDto: CreateSaleDTO) {
    return this.saleService.create(createSaleDto);
  }

  @Get()
  @ApiResponse({type: Sale, isArray: true})
  findAll() {
    return this.saleService.findAll();
  }

  @Get(':id')
  @ApiResponse({type: Sale})
  findOne(@Param('id') id: string) {
    return this.saleService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({type: UpdateSaleDTO})
  @ApiResponse({type: Sale})
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDTO) {
    return this.saleService.update(id, updateSaleDto);
  }

  @Delete(':id')
  @ApiResponse({type: null})
  remove(@Param('id') id: string) {
    return this.saleService.remove(id);
  }
}