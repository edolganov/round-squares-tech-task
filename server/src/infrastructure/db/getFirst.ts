export const getFirst = <T extends any[]>(values: T): T[number] => {
  if (values.length === 0) {
    throw new Error('cannot find values to return');
  }
  return values[0];
};
