import { ApiProperty } from "@nestjs/swagger";
import { Report } from "models/report.model";

export class UpdateReportDetailDTO {
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
    description: 'Reporte al que pertenece el registro',
    required: false
  })
  report?: Report;
}