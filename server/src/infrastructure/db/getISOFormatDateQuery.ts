import { SQL, sql } from 'drizzle-orm';
import { PgColumn } from 'drizzle-orm/pg-core';

export function getISOFormatDateQuery(dateTimeColumn: PgColumn): SQL<string> {
  // always return time in UTC offset without DB time config: for Z literal in the end
  return sql<string>`to_char(${dateTimeColumn} at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`;
}
