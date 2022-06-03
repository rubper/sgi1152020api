import { ApiProperty } from "@nestjs/swagger";
import { ReportTypes } from "constants/report-types.constant";
import { ValueTypes } from "constants/value-types.constant";
import { IReport } from "interfaces/report.interface";
import { Moment } from "moment";
import { Column } from "typeorm";
import { UUID } from "types/uuid.type";

export class UpdateReportDTO implements Partial<IReport> {
  @ApiProperty({
    description: 'Fecha del reporte',
    required: false,
  })
  @Column({type: 'timestamp'})
  date?: Moment;

  @ApiProperty({
    description: 'Tipo del reporte',
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
      'Los valores permitidos son: \'valoresNumericos\' | \'valoresSeparadosComas\'',
    required: false,
  })
  @Column({length: 21})
  dataType?: ValueTypes;

  @ApiProperty({
    description: 'El usuario asociado al guía.',
    required: true
  })
  user?: UUID;

}