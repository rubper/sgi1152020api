import { Injectable } from '@nestjs/common';

import { Report } from 'models/report.model';
import { CreateReportDTO } from 'interfaces/DTOs/report.create.dto';
import { UpdateReportDTO } from 'interfaces/DTOs/report.update.dto';

@Injectable()
export class ReportService {
  create(createDto: CreateReportDTO) {
    return new Report(createDto).save();
  }

  findAll() {
    return Report.find();
  }

  findOne(id: string) {
    return Report.findOne(id);
  }

  update(id: string, updateDto: UpdateReportDTO) {
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