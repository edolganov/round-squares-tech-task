import { and, count, eq, gte, lte } from 'drizzle-orm';
import { DrizzleService } from '../../infrastructure/drizzle/drizzle.service';
import { appRound, appUserTapEvent } from '../../generated/drizzle/schema';
import { findFirst } from '../../infrastructure/db/findFirst';

export async function selectUserTapsCount(
  orm: DrizzleService,
  userId: string,
  roundId: string,
) {
  return orm
    .db()
    .select({ count: count() })
    .from(appUserTapEvent)
    .leftJoin(appRound, eq(appUserTapEvent.roundId, appRound.id))
    .where(
      and(
        eq(appUserTapEvent.roundId, roundId),
        eq(appUserTapEvent.userId, userId),
        gte(appUserTapEvent.logTime, appRound.startAt),
        lte(appUserTapEvent.logTime, appRound.endAt),
      ),
    )
    .then(findFirst)
    .then((data) => data?.count || 0);
}
