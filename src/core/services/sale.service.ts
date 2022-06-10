import { Injectable } from '@nestjs/common';

import { Sale } from 'models/sale.model';
import { ISale } from 'interfaces/sale.interface';

@Injectable()
export class SaleService {
  create(createDto: Partial<ISale>) {
    return new Sale(createDto).save();
  }

  findAll() {
    return Sale.find();
  }

  findOne(id: string) {
    return Sale.findOne(id);
  }

  update(id: string, updateDto: Partial<ISale>) {
    return Sale.findOne(id).then((sale: Sale) => {
      sale.mapValueFromBase(updateDto);
      sale.save();
    });
  }

  remove(id: string) {
    return Sale.findOne(id).then((sale: Sale) => {
      sale.softRemove();
    });
  }
}
