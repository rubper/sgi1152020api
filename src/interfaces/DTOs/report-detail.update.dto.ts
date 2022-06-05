import { ApiProperty } from '@nestjs/swagger';
import { Report } from 'models/report.model';
import { IReportDetail } from 'interfaces/report-detail.interface';
import { UUID } from 'types/uuid.type';

export class UpdateReportDetailDTO implements Partial<IReportDetail> {
  @ApiProperty({
    description: 'Valor o valores en x de la tupla del reporte',
    required: false
  })
  x?: string;
  @ApiProperty({
    description: 'Valor o valores en y de la tupla del reporte.',
    required: false
  })
  y?: string;
  @ApiProperty({
    description: 'Valor o valores en z de la tupla del reporte.',
    required: false
  })
  z?: string;
  @ApiProperty({
    description: 'Valor o valores en xx de la tupla del reporte.',
    required: false
  })
  xx?: string;
  @ApiProperty({
    description: 'Valor o valores en yy de la tupla del reporte.',
    required: false
  })
  yy?: string;
  @ApiProperty({
    description: 'Valor o valores en zz de la tupla del reporte.',
    required: false
  })
  zz?: string;
  @ApiProperty({
    description: 'El UUID del reporte al que pertenece el registro',
    required: false
  })
  report?: UUID;
}