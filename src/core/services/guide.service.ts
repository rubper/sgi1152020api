import { Injectable } from '@nestjs/common';

import { Guide } from 'models/guide.model';
import { CreateGuideDTO } from 'interfaces/DTOs/guide.create.dto';
import { UpdateGuideDTO } from 'interfaces/DTOs/guide.update.dto';

@Injectable()
export class GuideService {
  create(createDto: CreateGuideDTO) {
    return new Guide(createDto).save();
  }

  findAll() {
    return Guide.find();
  }

  findOne(id: string) {
    return Guide.findOne(id);
  }

  update(id: string, updateDto: UpdateGuideDTO) {
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