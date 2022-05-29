import { DataValue } from 'types/data-value.type';
import { Separators } from 'constants/separators.constant';
import { CreateDataDTO } from 'shared/dtos/_create-data.dto';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';
import { IReportDetail } from 'interfaces/report-detail.interface';
import { UUID } from 'types/uuid.type';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from './report.model';

export type DataAxis = 'x' | 'y' | 'z' | 'xx' | 'yy' | 'zz';

@Entity()
export class ReportDetail extends BuildableEntity<IReportDetail> implements IReportDetail{ 
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @Column()
  x: string;

  @Column()
  y: string;

  @Column({nullable: true})
  z?: string;

  @Column({nullable: true})
  xx?: string;

  @Column({nullable: true})
  yy?: string;

  @Column({nullable: true})
  zz?: string;

  // relationships
  @ManyToOne(type => Report, report => report.reportDetails)
  report: Report;

  get xValues(): DataValue[] {
    return this.parseData(this.x);
  } 
  get yValues(): DataValue[]{
    return this.parseData(this.x);
  } 
  get zValues(): DataValue[] | undefined {
    return this.parseData(this.x);
  } 
  get xxValues(): DataValue[] | undefined {
    return this.parseData(this.x);
  } 
  get yyValues(): DataValue[] | undefined {
    return this.parseData(this.x);
  } 
  get zzValues(): DataValue[] | undefined {
    return this.parseData(this.x);
  } 
  
  constructor(createDTO?: CreateDataDTO) {
    super();
    if (createDTO) {
      this.x = createDTO.x;
      this.y = createDTO.y;
      if (createDTO.z) {
        this.z = createDTO.z;
      }
      if (createDTO.xx) {
        this.xx = createDTO.xx;
      }
      if (createDTO.yy) {
        this.yy = createDTO.yy;
      }
      if (createDTO.zz) {
        this.zz = createDTO.zz;
      }
    }
  }

  parseData(data: string): DataValue[] {
    const splittedData = data.split(Separators.DATA);
    const isNaNData = splittedData.every((value: any) => isNaN(value));
    const isNumericData = splittedData.every((value: any) => !isNaN(value));
    if (isNumericData) {
      return splittedData.map((splittedValue: string) => Number(splittedValue))
    } else if (isNaNData) {
      return splittedData
    } else {
      throw new Error('All provided data must be of the same type');      
    }
  }
}