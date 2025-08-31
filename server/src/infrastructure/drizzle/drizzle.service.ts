import { Injectable } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PgService } from '../pg/pg.service';
import { Config } from '../../config';
import type { PgTable } from 'drizzle-orm/pg-core/table';
import { Column } from 'drizzle-orm/column';
import { Util } from '../../common/utils/Util';
import { asType } from '../../common/utils/ts/asType';
import { StringUtil } from '../../common/utils/StringUtil';
import * as schema from '../../generated/drizzle/schema';
import * as relations from '../../generated/drizzle/relations';

export const DrizzleSchema = {
  ...schema,
  ...relations,
};

export type DB = NodePgDatabase<typeof DrizzleSchema>;

export interface TtlData {
  table: PgTable;
  dateColumn: Column;
}

const log = Util.getLog('DrizzleService');

@Injectable()
export class DrizzleService {
  private readonly _db: DB;
  private ttlClean = {
    list: asType<TtlData[]>([]),
    lastCall: 0,
    inProcess: false,
  };
  private oldClean = {
    list: asType<TtlData[]>([]),
    lastCall: 0,
    inProcess: false,
  };

  constructor(pg: PgService) {
    const dbLogger = {
      logQuery: (query: string, params: unknown[]) => {
        const queryLogString = (query || '').includes('select')
          ? toSelectLogString(query)
          : query;
        log.info(
          StringUtil.truncateMiddle(queryLogString, 500),
          ', vals:',
          ...params,
        );
      },
    };

    this._db = drizzle({
      client: pg.pool(),
      logger: Config.drizzle.showLogs ? dbLogger : undefined,
      schema: DrizzleSchema,
    });
  }

  db() {
    return this._db;
  }
}

function toSelectLogString(query: string) {
  if (!query.startsWith('select')) {
    return query;
  }
  const [, fromPart] = query.split(' from ');
  return `select ... from ${fromPart}`;
}
