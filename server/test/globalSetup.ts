import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import { Config, storeConfig } from '../src/config';
import { processMigration } from '../src/infrastructure/db_migration/processMigration';
import { saveTestCtxGlobal, TestCtx } from './common';

export default async (): Promise<void> => {
  console.log('');
  console.log('🚀 Setting up db...');

  TestCtx.container = await new PostgreSqlContainer('postgres:17.0').start();
  TestCtx.pgClient = new Client({
    connectionString: TestCtx.container.getConnectionUri(),
  });

  const { pgClient, container } = TestCtx;
  pgClient.on('error', console.error);
  await pgClient.connect();

  Config.db = {
    port: container.getPort(),
    host: container.getHost(),
    user: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
    ssl: false,
    skipTerminatingConnectionError: true, // for hard ending in CI
    poolMin: Config.db.poolMin,
    poolMax: Config.db.poolMax,
  };
  await processMigration();

  TestCtx.config = Config;
  saveTestCtxGlobal();
};
