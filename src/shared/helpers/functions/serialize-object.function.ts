import { isObjectLike } from './is-object-like.function';

export const serializeObject = (outputValue: any) => {
  if (isObjectLike(outputValue)) {
    if (typeof outputValue.valueOf === 'function') {
      const valueOfResult = outputValue.valueOf();

      if (!isObjectLike(valueOfResult)) {
        return valueOfResult;
      }
    }

    if (typeof outputValue.toJSON === 'function') {
      return outputValue.toJSON();
    }
  }
  return outputValue;
}