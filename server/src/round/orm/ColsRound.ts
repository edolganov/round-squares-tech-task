import { getTableColumns } from 'drizzle-orm';
import { appRound } from '../../generated/drizzle/schema';
import { getISOFormatDateQuery } from '../../infrastructure/db/getISOFormatDateQuery';

const cols = getTableColumns(appRound);
export const ColsRound = {
  ...cols,
  visibleAt: getISOFormatDateQuery(cols.visibleAt),
  startAt: getISOFormatDateQuery(cols.startAt),
  endAt: getISOFormatDateQuery(cols.endAt),
};
