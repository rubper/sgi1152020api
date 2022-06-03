import { Injectable } from '@nestjs/common';

import { Sale } from 'models/sale.model';
import { CreateSaleDTO } from 'interfaces/DTOs/sale.create.dto';
import { UpdateSaleDTO } from 'interfaces/DTOs/sale.update.dto';

@Injectable()
export class SaleService {
  create(createDto: CreateSaleDTO) {
    return new Sale(createDto).save();
  }

  findAll() {
    return Sale.find();
  }

  findOne(id: string) {
    return Sale.findOne(id);
  }

  update(id: string, updateDto: UpdateSaleDTO) {
    return Sale.findOne(id).then(
      (sale: Sale) => {
        sale.mapValueFromBase(updateDto);
        sale.save();
      }
    );
  }

  remove(id: string) {
    return Sale.findOne(id).then(
      (sale: Sale) => {
        sale.softRemove();
      }
    );
  }
}