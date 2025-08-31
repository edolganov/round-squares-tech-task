import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';
import { Config } from './src/config';

export default defineConfig({
  dialect: 'postgresql',
  out: './src/generated/drizzle',
  dbCredentials: {
    host: Config.db.host,
    user: Config.db.user,
    password: Config.db.password,
    database: Config.db.database,
    port: Config.db.port,
    ssl: Config.db.ssl,
  },
  tablesFilter: ['app_*'],
});
