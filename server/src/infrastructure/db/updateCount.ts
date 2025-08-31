export const updateCount = <T extends { rowCount: number | null }>({ rowCount }: T) => {
  return rowCount || 0;
};
