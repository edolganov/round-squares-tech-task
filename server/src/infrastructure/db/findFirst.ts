export const findFirst = <T extends any[]>(values: T): T[number] | undefined => {
  return values.length > 0 ? values[0]! : undefined;
};
