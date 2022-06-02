import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { SaleService } from 'core/services/sale.service';
import { CreateSaleDTO } from 'interfaces/DTOs/sale.create.dto';
import { UpdateSaleDTO } from 'interfaces/DTOs/sale.update.dto';
import { ISale } from 'interfaces/sale.interface';
import { Sale } from 'models/sale.model';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UpdateDTO } from 'shared/helpers/base/update-dto.type';

@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  @ApiBody({type: CreateSaleDTO})
  create(@Body() createSaleDto: CreateDTO<ISale>) {
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
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateDTO<ISale>) {
    return this.saleService.update(id, updateSaleDto);
  }

  @Delete(':id')
  @ApiResponse({type: null})
  remove(@Param('id') id: string) {
    return this.saleService.remove(id);
  }
}