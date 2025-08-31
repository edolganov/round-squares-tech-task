import { and, desc, eq, gte, lte, sql } from 'drizzle-orm';
import { DrizzleService } from '../../infrastructure/drizzle/drizzle.service';
import {
  appRound,
  appUser,
  appUserTapEvent,
} from '../../generated/drizzle/schema';

/*
our QUERY:
```sql
    SELECT
        u.id,
        u.login,
        COUNT(t.user_id) AS tap_count
    FROM
        app_user_tap_event AS t
    JOIN app_user AS u ON t.user_id = u.id
    JOIN app_round AS r ON t.round_id = r.id
    WHERE
        r.id = 'your_round_id_here'
        AND t.log_time >= r.start_at
      AND t.log_time <= r.end_at
    GROUP BY
        u.id, u.login
    ORDER BY
        tap_count DESC
```
 */
export async function selectAllUsersTapsCount(
  orm: DrizzleService,
  roundId: string,
) {
  return orm
    .db()
    .select({
      userId: appUser.id,
      userLogin: appUser.login,
      tapCount: sql`count(${appUserTapEvent.logTime})`
        .mapWith(Number)
        .as('tapCount'),
    })
    .from(appUser)
    .leftJoin(appUserTapEvent, eq(appUser.id, appUserTapEvent.userId))
    .leftJoin(appRound, eq(appUserTapEvent.roundId, appRound.id))
    .where(
      and(
        eq(appUserTapEvent.roundId, roundId),
        gte(appUserTapEvent.logTime, appRound.startAt),
        lte(appUserTapEvent.logTime, appRound.endAt),
      ),
    )
    .groupBy(appUser.id, appUser.login)
    .orderBy(desc(sql`"tapCount"`));
}
