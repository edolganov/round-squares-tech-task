import { migrate } from 'postgres-migrations';
import { Util } from '../../common/utils/Util';
import { Config } from '../../config';
import { Client } from 'pg';
import * as fs from 'node:fs';

const log = Util.getLog('infrastructure/db_migration');

export async function processMigration(config?: {
  showLogs?: boolean;
  makeDbData?: boolean;
}) {
  log.info(`db migration start: ${Config.db.host}:${Config.db.port} ...`);

  const client = new Client({
    host: Config.db.host,
    port: Config.db.port,
    user: Config.db.user,
    password: Config.db.password,
    database: Config.db.database,
    ssl: Config.db.ssl,
  });

  await client.connect();

  try {
    await migrate(
      {
        client,
      },
      './db/migrations',
      {
        logger: (msg) => {
          if (config?.showLogs) {
            log.info(msg);
          }
        },
      },
    );

    if (config?.makeDbData) {
      fs.mkdirSync('./src/generated/db', { recursive: true });
      let dataLog = '// prettier-ignore\n';
      dataLog += '\n\n' + (await toDataLog(client, 'app_role'));
      fs.writeFileSync('./src/generated/db/data.ts', dataLog, 'utf-8');
    }
  } finally {
    await client.end();
  }

  log.info('db migration done.');
}

async function toDataLog(client: Client, tableName: string) {
  const { rows } = await client.query(`SELECT * FROM ${tableName}`);
  return (
    `export const data_log_${tableName} = ${JSON.stringify(rows, null, 2)} as const;` +
    `\nexport const data_log_${tableName}_values = [${rows.map((data) => `"${data.value}"`).join(',')}] as const;`
  );
}
