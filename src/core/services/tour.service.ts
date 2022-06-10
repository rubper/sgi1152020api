import { Injectable } from '@nestjs/common';

import { Tour } from 'models/tour.model';
import { CreateTourDTO } from 'DTOs/tour.create.dto';
import { UpdateTourDTO } from 'DTOs/tour.update.dto';

@Injectable()
export class TourService {
  create(createDto: CreateTourDTO) {
    return new Tour(createDto).save();
  }

  findAll() {
    return Tour.find();
  }

  findOne(id: string) {
    return Tour.findOne(id);
  }

  update(id: string, updateDto: UpdateTourDTO) {
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