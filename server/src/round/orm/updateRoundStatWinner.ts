import { DrizzleService } from '../../infrastructure/drizzle/drizzle.service';
import { and, eq, lte, sql } from 'drizzle-orm';
import { isAnyUpdate } from '../../infrastructure/db/isAnyUpdate';
import { WinnerInfo } from '../types';
import { appRound } from '../../generated/drizzle/schema';

export async function updateRoundStatWinner(
  orm: DrizzleService,
  roundId: string,
  { winner, winnerScore, totalScore }: WinnerInfo,
) {
  return orm
    .db()
    .update(appRound)
    .set({
      statWinner: winner,
      statWinnerScore: winnerScore,
      statTotalScore: totalScore,
    })
    .where(and(eq(appRound.id, roundId), lte(appRound.endAt, sql`NOW()`)))
    .then(isAnyUpdate);
}
