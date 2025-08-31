import { Client } from 'pg';
import { Config } from '../src/config';
import * as crypto from 'node:crypto';

async function init() {
  console.info('start reset db SCHEMA...');

  try {
    const client = new Client({
      host: Config.db.host,
      port: Config.db.port,
      user: Config.db.user,
      password: Config.db.password,
      database: Config.db.database,
      ssl: Config.db.ssl,
    });

    await client.connect();
    await client.query('DROP SCHEMA IF EXISTS "public" CASCADE;');
    await client.query('CREATE SCHEMA "public";');
    await client.end();

    console.info('db SCHEMA reset successfully');
  } catch (e) {
    console.error('cannot reset', e);
  }
}

init().catch(console.error);
