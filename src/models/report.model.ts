import { User } from './user.model';
import { UUID } from 'types/uuid.type';
import { ReportDetail } from 'models/report-detail.model';
import { ReportTypes } from 'constants/report-types.constant';

import { IReport } from 'interfaces/report.interface';
import { BuildableEntity } from 'shared/helpers/base/buildable.entity'

import { Moment } from 'moment';
import { Column, ManyToOne, OneToMany, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ValueTypes } from 'constants/value-types.constant';

@Entity()
export class Report extends BuildableEntity<IReport> implements IReport {
  @ApiProperty({
    description: 'Identificador unico autogenerado del registro',
    required: false,
    readOnly: true,
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @ApiProperty({
    description: 'Fecha del reporte',
    required: true,
  })
  @Column({type: 'timestamp'})
  date: Moment;

  @ApiProperty({
    description: 'Tipo del reporte',
    required: true,
  })
  @Column({length: 50})
  type: ReportTypes;
  
  @ApiProperty({
    description: 'Tipo de datos a manejar en el detalle. ' + 
      'Dado que es posible almacenar en una sola cadena de texto, ' +
      'valores separados por comas (o puntos y comas segun la region)' +
      'es posible decidir, mediante esta bandera, el tipo de dato que ' +
      'se almacenará en los campos X, Y, y demás, del detalle de reporte.' +
      'Los valores permitidos son: \'valoresNumericos\' | \'valoresSeparadosComas\'',
    required: true,
  })
  @Column({length: 21})
  dataType: ValueTypes;
  
  // relationships
  @ApiProperty({
    description: 'Tabla de datos de 2 a 6 columnas que almacena la informacion utilizada para realizar el reporte',
    required: false,
  })
  @OneToMany(type => ReportDetail, detail => detail.report, {nullable: true})
  reportDetails?: ReportDetail[];

  @ApiProperty({
    description: 'Autor del reporte',
    required: true,
    type: () => User
  })
  @ManyToOne(type => User, user => user.reports)
  author: User;
}
