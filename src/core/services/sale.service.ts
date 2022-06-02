import { Injectable } from '@nestjs/common';
import { ISale } from 'interfaces/sale.interface';
import { Sale } from 'models/sale.model';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UpdateDTO } from 'shared/helpers/base/update-dto.type';

@Injectable()
export class SaleService {
  create(createDto: CreateDTO<ISale>) {
    return new Sale(createDto).save();
  }

  findAll() {
    return Sale.find();
  }

  findOne(id: string) {
    return Sale.findOne(id);
  }

  update(id: string, updateDto: UpdateDTO<ISale>) {
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