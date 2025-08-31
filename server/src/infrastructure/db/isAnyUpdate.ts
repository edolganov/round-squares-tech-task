export const isAnyUpdate = <T extends { rowCount: number | null }>({ rowCount }: T) => {
  return !!rowCount && rowCount > 0;
};
