import { DataValue } from 'types/data-value.type';

export type CreateDataDTO = {
  x: DataValue[]; 
  y: DataValue[];
  z?: DataValue[];
  xx?: DataValue[];
  yy?: DataValue[];
  zz?: DataValue[];
} | {
  x: string;
  y: string;
  z?: string;
  xx?: string;
  yy?: string;
  zz?: string;
}