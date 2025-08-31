import { DrizzleService } from '../../infrastructure/drizzle/drizzle.service';
import { InsertValues } from '../../infrastructure/drizzle/orm/types';
import { appRound } from '../../generated/drizzle/schema';
import { ColsRound } from './ColsRound';
import { getFirst } from '../../infrastructure/db/getFirst';

export async function insertRound(
  orm: DrizzleService,
  values: InsertValues<typeof appRound>,
) {
  return orm
    .db()
    .insert(appRound)
    .values(values)
    .returning({ ...ColsRound })
    .then(getFirst);
}
