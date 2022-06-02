import { Injectable } from '@nestjs/common';
import { IGuide } from 'interfaces/guide.interface';
import { Guide } from 'models/guide.model';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UpdateDTO } from 'shared/helpers/base/update-dto.type';

@Injectable()
export class GuideService {
  create(createDto: CreateDTO<IGuide>) {
    return new Guide(createDto).save();
  }

  findAll() {
    return Guide.find();
  }

  findOne(id: string) {
    return Guide.findOne(id);
  }

  update(id: string, updateDto: UpdateDTO<IGuide>) {
    return Guide.findOne(id).then(
      (guide: Guide) => {
        guide.mapValueFromBase(updateDto);
        guide.save();
      }
    );
  }

  remove(id: string) {
    return Guide.findOne(id).then(
      (guide: Guide) => {
        guide.softRemove();
      }
    );
  }
}