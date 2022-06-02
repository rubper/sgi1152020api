import { DataValue } from 'types/data-value.type';
import { Separators } from 'constants/separators.constant';
import { CreateDataDTO } from 'shared/dtos/_create-data.dto';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity';
import { IReportDetail } from 'interfaces/report-detail.interface';
import { UUID } from 'types/uuid.type';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from './report.model';
import { ApiProperty } from '@nestjs/swagger';

export type DataAxis = 'x' | 'y' | 'z' | 'xx' | 'yy' | 'zz';

@Entity()
export class ReportDetail extends BuildableEntity<IReportDetail> implements IReportDetail{ 
  @ApiProperty({
    description: 'Identificador unico autogenerado del registro',
    required: false,
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @ApiProperty({
    description: 'Valor en x del registro',
    required: true
  })
  @Column()
  x: string;

  @ApiProperty({
    description: 'Valor en y del registro',
    required: true
  })
  @Column()
  y: string;

  @ApiProperty({
    description: 'Valor opcional en z del registro',
    required: false
  })
  @Column({nullable: true})
  z?: string;

  @ApiProperty({
    description: 'Valor opcional en x auxiliar del registro',
    required: false
  })
  @Column({nullable: true})
  xx?: string;

  @ApiProperty({
    description: 'Valor opcional en y auxiliar del registro',
    required: false
  })
  @Column({nullable: true})
  yy?: string;

  @ApiProperty({
    description: 'Valor opcional en z auxiliar del registro',
    required: false
  })
  @Column({nullable: true})
  zz?: string;

  // relationships
  @ApiProperty({
    description: 'Reporte al que pertenece el registro',
    required: false
  })
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