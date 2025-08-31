import { PgUpdateSetSource } from 'drizzle-orm/pg-core/query-builders/update';
import { PgTable } from 'drizzle-orm/pg-core';
import { PgInsertValue } from 'drizzle-orm/pg-core';

export type UpdateValues<T extends PgTable> = PgUpdateSetSource<T>;
export type InsertValues<T extends PgTable> = PgInsertValue<T>;
