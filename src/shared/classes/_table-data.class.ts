import { DataValue } from 'types/data-value.type';
import { Separators } from 'constants/separators.constant';
import { CreateDataDTO } from 'shared/dtos/_create-data.dto';

export type DataAxis = 'x' | 'y' | 'z' | 'xx' | 'yy' | 'zz';


export class TableData { 
  xValues: DataValue[]; 
  yValues: DataValue[];
  zValues?: DataValue[];
  xxValues?: DataValue[];
  yyValues?: DataValue[];
  zzValues?: DataValue[];
  
  constructor(createDTO: CreateDataDTO) {
    this.setValue('x', createDTO.x);
    this.setValue('y', createDTO.y);
    if (createDTO.z) {
      this.setValue('z', createDTO.z);
    }
    if (createDTO.xx) {
      this.setValue('xx', createDTO.xx);
    }
    if (createDTO.yy) {
      this.setValue('yy', createDTO.yy);
    }
    if (createDTO.zz) {
      this.setValue('zz', createDTO.zz);
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

  setValue(property: DataAxis, value: string | DataValue[]): DataValue[] {
    let dataArray: DataValue[];
    if (typeof value === 'string') {
      dataArray = this.parseData(value);
    } else {
      dataArray = value;
    }
    this[`${property}Values`] = dataArray;
    return dataArray;
  }
}