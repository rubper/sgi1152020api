import { Injectable } from '@nestjs/common';
import { CreateVolunteerDTO } from 'DTOs/volunteer.create.dto';
import { UpdateVolunteerDTO } from 'DTOs/volunteer.update.dto';
import { IVolunteer } from 'interfaces/volunteer.interface';
import { Volunteer } from 'models/volunteer.model';

@Injectable()
export class VolunteerService {
  create(createDto: Partial<IVolunteer>) {
    return new Volunteer(createDto).save();
  }

  findAll() {
    return Volunteer.find();
  }

  findOne(id: string) {
    return Volunteer.findOne(id);
  }

  update(id: string, updateDto: Partial<IVolunteer>) {
    return Volunteer.findOne(id).then((Volunteer: Volunteer) => {
      Volunteer.mapValueFromBase(updateDto);
      Volunteer.save();
    });
  }

  remove(id: string) {
    return Volunteer.findOne(id).then((Volunteer: Volunteer) => {
      Volunteer.softRemove();
    });
  }
}
