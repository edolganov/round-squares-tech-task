import { and, desc, gte, lte } from 'drizzle-orm';
import { DrizzleService } from '../../infrastructure/drizzle/drizzle.service';
import { appRound } from '../../generated/drizzle/schema';
import { OneWeek } from '../../common/utils/date/const';
import { ColsRound } from './ColsRound';

export async function selectTopVisibleRounds(
  orm: DrizzleService,
  visibleDate: Date,
  limit: number,
) {
  const lastOldDate = new Date(visibleDate.getTime() - OneWeek);
  return orm
    .db()
    .select({ ...ColsRound })
    .from(appRound)
    .where(
      and(
        lte(appRound.visibleAt, visibleDate.toISOString()),
        gte(appRound.visibleAt, lastOldDate.toISOString()),
      ),
    )
    .orderBy(desc(appRound.visibleAt))
    .limit(limit);
}
