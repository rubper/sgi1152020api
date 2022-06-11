import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { Sale } from 'models/sale.model';
import { SaleService } from 'core/services/sale.service';
import { CreateSaleDTO } from 'DTOs/sale.create.dto';
import { UpdateSaleDTO } from 'DTOs/sale.update.dto';
import { SetRoles } from 'auth/helpers/auth.decorators';
import { RolesGuard } from 'auth/helpers/roles.guard';
import { ISale } from 'interfaces/sale.interface';

@Controller('sale')
@SetRoles()
@ApiTags('1. Ventas')
@UseGuards(RolesGuard)
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  @ApiBody({ type: CreateSaleDTO })
  create(@Body() createSaleDto: CreateSaleDTO) {
    const newSale: Partial<ISale> = {
      ownerFirstName: createSaleDto.nombreComprador,
      ownerLastName: createSaleDto.apellidoComprador,
      ownerEmail: createSaleDto.email,
      ownerPhone: createSaleDto.telefono,
      seller: createSaleDto.usuarioVendedor,
      kidsQuantity: createSaleDto.cantidadNinos,
      adultsQuantity: createSaleDto.cantidadAdultos,
      total: createSaleDto.total,
    };
    return this.saleService.create(newSale);
  }

  @Get()
  @ApiResponse({ type: Sale, isArray: true })
  findAll() {
    return this.saleService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: Sale })
  findOne(@Param('id') id: string) {
    return this.saleService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateSaleDTO })
  @ApiResponse({ type: Sale })
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDTO) {
    const newSale: Partial<ISale> = {};
    if (updateSaleDto.nombreComprador) {
      newSale.ownerFirstName = updateSaleDto.nombreComprador;
    }
    if (updateSaleDto.apellidoComprador) {
      newSale.ownerLastName = updateSaleDto.apellidoComprador;
    }
    if (updateSaleDto.email) {
      newSale.ownerEmail = updateSaleDto.email;
    }
    if (updateSaleDto.telefono) {
      newSale.ownerPhone = updateSaleDto.telefono;
    }
    if (updateSaleDto.cantidadAdultos) {
      newSale.adultsQuantity = updateSaleDto.cantidadAdultos;
    }
    if (updateSaleDto.cantidadNinos) {
      newSale.kidsQuantity = updateSaleDto.cantidadNinos;
    }
    if (updateSaleDto.total) {
      newSale.total = updateSaleDto.total;
    }
    if (updateSaleDto.usuarioVendedor) {
      newSale.seller = updateSaleDto.usuarioVendedor;
    }
    return this.saleService.update(id, updateSaleDto);
  }

  @Delete(':id')
  @ApiResponse({ type: null })
  remove(@Param('id') id: string) {
    return this.saleService.remove(id);
  }
}
