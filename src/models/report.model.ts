import { User } from './user.model';
import { UUID } from 'types/uuid.type';
import { DataValue } from 'types/data-value.type';
import { TableData } from 'shared/classes/_table-data.class';
import { ReportTypes } from 'constants/report-types.constant';

import { IReport } from 'interfaces/report.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity'

import { Moment } from 'moment';

export class Report extends BuildableEntity<IReport> implements IReport {
  uuid: UUID;
  date: Moment;
  data: TableData;
  type: ReportTypes;
  author: User;
  x?: DataValue[];
  y?: DataValue[];
  z?: DataValue[];

  extractData(data: TableData): void {
    this.x = data.xValues;
    this.y = data.yValues;
    if (data.zValues)
      this.z = data.zValues;
  }

  saveTableDataObject(x: DataValue[], y: DataValue[], z?: DataValue[]): TableData {
    const dataSource = {x, y};
    if (z)
      dataSource['z'] = z;
    const dataObject = new TableData(dataSource);
    this.data = dataObject;
    return dataObject; 
  }
}
