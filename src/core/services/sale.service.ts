import { Injectable } from '@nestjs/common';

import { Sale } from 'models/sale.model';
import { ISale } from 'interfaces/sale.interface';
import { faker } from '@faker-js/faker';
import { filter, first, from, Observable, switchMap, combineLatest } from 'rxjs';
import { User } from 'models/user.model';

const TICKET_VALUE = 1.25;

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

  generateFakeSales(salesQuantity: number) {
    return from(Sale.find())
      .pipe(
        first(),
        filter(
          (sales: Sale[]) => sales.length < salesQuantity
        ),
        switchMap(
          () => from(User.find())
        ),
        switchMap(
          (users: User[]) => {
            const fakeSeller = users[0];
            if (!fakeSeller) {
              return;
            }
            const salesResults: Observable<Sale>[] = [];
            for (let index = 1; index <= salesQuantity; index++) {
              const lastName = faker.name.lastName();
              const firstName = faker.name.firstName();
              const email = faker.internet.email(firstName, lastName);
              const kidsQuantity = Number(faker.random.numeric(1, {allowLeadingZeros: false}));
              const adultsQuantity = Number(faker.random.numeric(1, {allowLeadingZeros: false}));
              const amount = kidsQuantity + adultsQuantity;
              const total = amount * TICKET_VALUE;
              const sale: Partial<ISale> = {
                total,
                amount,
                kidsQuantity,
                adultsQuantity,
                ownerEmail: email,
                seller: fakeSeller.uuid,
                ownerLastName: lastName,
                ownerFirstName: firstName,
                ownerPhone: faker.phone.phoneNumber(),
              };
              const newSale = new Sale(sale);
              const saleResult = from(newSale.save());
              salesResults.push(saleResult);
            }
            return combineLatest(salesResults);
          }
        )
      )
  }
}
