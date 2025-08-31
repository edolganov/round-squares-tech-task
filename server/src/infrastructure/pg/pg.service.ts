import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { Config } from '../../config';
import { Util } from '../../common/utils/Util';

const log = Util.getLog('infrastructure/pg');

@Injectable()
export class PgService {
  private readonly _pool: Pool;

  constructor() {
    log.info(`Connect to pg: ${Config.db.host}:${Config.db.port} ...`);
    this._pool = new Pool({
      host: Config.db.host,
      user: Config.db.user,
      password: Config.db.password,
      database: Config.db.database,
      port: Config.db.port,
      ssl: Config.db.ssl,
    });
    this._pool.on('error', (error) => {
      if (
        Config.db.skipTerminatingConnectionError &&
        (error.message?.toLowerCase().includes('terminating connection') ||
          error.message?.toLowerCase().includes('connection terminated'))
      ) {
        return;
      }
      log.error(error);
    });
  }

  pool(): Pool {
    return this._pool;
  }
}
