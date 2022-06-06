export const flatArray = <T = any>(elementsArray: T[][]): T[] => {
  let auxArray: T[] = [];
  elementsArray.forEach(
    (element: T[]) => {
      auxArray = auxArray.concat(element);
    }
  );
  return auxArray;
}