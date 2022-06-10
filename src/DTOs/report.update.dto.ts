import { ApiProperty } from "@nestjs/swagger";
import { ReportTypes } from "constants/report-types.constant";
import { ValueTypes } from "constants/value-types.constant";
import { IReport } from "interfaces/report.interface";
import { Moment } from "moment";
import { Column } from "typeorm";
import { UUID } from "types/uuid.type";

export class UpdateReportDTO implements Partial<IReport> {
  @ApiProperty({
    description: 'Fecha del reporte en ISO string',
    required: false,
  })
  @Column({type: 'timestamp'})
  date?: string;

  @ApiProperty({
    description: 'Tipo del reporte. Valores permitidos: \'sales\' \'guides\'',
    required: false,
  })
  @Column({length: 50})
  type?: ReportTypes;
  
  @ApiProperty({
    description: 'Tipo de datos a manejar en el detalle. ' + 
      'Dado que es posible almacenar en una sola cadena de texto, ' +
      'valores separados por comas (o puntos y comas segun la region)' +
      'es posible decidir, mediante esta bandera, el tipo de dato que ' +
      'se almacenará en los campos X, Y, y demás, del detalle de reporte.' +
      'Valores permitidos: \'valoresNumericos\' | \'valoresSeparadosComas\'',
    required: false,
  })
  @Column({length: 21})
  dataType?: ValueTypes;

  @ApiProperty({
    description: 'El UUID del usuario del autor del reporte.',
    required: true
  })
  author?: UUID;

}