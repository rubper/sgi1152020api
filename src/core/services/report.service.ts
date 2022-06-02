import { Injectable } from '@nestjs/common';
import { IReport } from 'interfaces/report.interface';
import { Report } from 'models/report.model';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UpdateDTO } from 'shared/helpers/base/update-dto.type';

@Injectable()
export class ReportService {
  create(createDto: CreateDTO<IReport>) {
    return new Report(createDto).save();
  }

  findAll() {
    return Report.find();
  }

  findOne(id: string) {
    return Report.findOne(id);
  }

  update(id: string, updateDto: UpdateDTO<IReport>) {
    return Report.findOne(id).then(
      (report: Report) => {
        report.mapValueFromBase(updateDto);
        report.save();
      }
    );
  }

  remove(id: string) {
    return Report.findOne(id).then(
      (report: Report) => {
        report.softRemove();
      }
    );
  }
}