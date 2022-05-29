import { Injectable } from '@nestjs/common';
import { ITour } from 'interfaces/tour.interface';
import { Tour } from 'models/tour.model';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UpdateDTO } from 'shared/helpers/base/update-dto.type';

@Injectable()
export class TourService {
  create(createDto: CreateDTO<ITour>) {
    new Tour(createDto).save();
  }

  findAll() {
    return Tour.find();
  }

  findOne(id: string) {
    return Tour.findOne(id);
  }

  update(id: string, updateDto: UpdateDTO<ITour>) {
    return Tour.findOne(id).then(
      (tour: Tour) => {
        tour.mapValueFromBase(updateDto);
        tour.save();
      }
    );
  }

  remove(id: string) {
    return Tour.findOne(id).then(
      (tour: Tour) => {
        tour.softRemove();
      }
    );
  }
}