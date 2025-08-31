import { DrizzleService } from '../../infrastructure/drizzle/drizzle.service';
import { appRound, appUserTapEvent } from '../../generated/drizzle/schema';
import { isAnyUpdate } from '../../infrastructure/db/isAnyUpdate';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { Util } from '../../common/utils/Util';

export async function insertUserTapForValidRound(
  orm: DrizzleService,
  roundId: string,
  userId: string,
) {
  const logTime = new Date().toISOString();
  const db = orm.db();
  return db
    .insert(appUserTapEvent)
    .select(
      db
        .select({
          logTime: sql`${logTime}`.as('logTime'),
          roundId: appRound.id,
          userId: sql`${userId}`.as('userId'),
        })
        .from(appRound)
        .where(
          and(
            eq(appRound.id, roundId),
            lte(appRound.startAt, sql`NOW()`),
            gte(appRound.endAt, sql`NOW()`),
          ),
        ),
    )
    .onConflictDoNothing()
    .then(isAnyUpdate);
}
