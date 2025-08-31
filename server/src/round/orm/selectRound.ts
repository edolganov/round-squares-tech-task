import { eq } from 'drizzle-orm';
import { DrizzleService } from '../../infrastructure/drizzle/drizzle.service';
import { appRound } from '../../generated/drizzle/schema';
import { ColsRound } from './ColsRound';
import { findFirst } from '../../infrastructure/db/findFirst';

export async function selectRound(orm: DrizzleService, roundId: string) {
  return orm
    .db()
    .select({ ...ColsRound })
    .from(appRound)
    .where(eq(appRound.id, roundId))
    .then(findFirst);
}
