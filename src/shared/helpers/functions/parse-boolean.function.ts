export const TRUE_REGEX = /^(true|yes|t|y|1)$/i;
export const FALSE_REGEX = /^(false|no|f|n|0)$/i;

export function parseBoolean(value: string) {
  let boolResult: boolean | undefined;
  const matches = _trueOrFalse(value);
  const isTrue: boolean = matches && matches.true && matches.true.length > 0;
  const isFalse: boolean = matches && matches.false && matches.false.length > 0;
  if (!isTrue && !isFalse) {
    boolResult = undefined;
  } else {
    boolResult = isTrue ? true : false;
  }
  return boolResult;
}

function _trueOrFalse(value: string) {
  const trimmedValue = value?.trim();
  if (!trimmedValue) {
    return;
  }
  return {
    true: trimmedValue.match(TRUE_REGEX),
    false: trimmedValue.match(FALSE_REGEX)
  }
}