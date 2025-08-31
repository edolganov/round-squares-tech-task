import 'dotenv/config';
import { Util } from './common/utils/Util';
import process from 'node:process';
import { StringValue } from 'ms';

const isDev = process.env.ENV === 'dev';

export const Config = {
  isDev,
  round: {
    roundDurationSec: Math.max(
      Util.parseInt(process.env.ROUND_DURATION, 60),
      10,
    ),
    cooldownDurationSec: Math.max(
      Util.parseInt(process.env.COOLDOWN_DURATION, 30),
      0,
    ),
  },
  db: {
    host: process.env.DB_HOST || 'change-me',
    user: process.env.DB_USER || 'change-me',
    password: process.env.DB_PSW || 'change-me',
    database: process.env.DB_DATABASE || 'change-me',
    port: Util.parseInt(process.env.DB_PORT, 0),
    ssl: process.env.DB_SSL === 'true',
    skipTerminatingConnectionError: false,
    poolMin: Util.parseInt(process.env.DB_POOL_MIN, 3),
    poolMax: Util.parseInt(process.env.DB_POOL_MAX, 10),
  },
  drizzle: {
    showLogs: Util.parseBool(process.env.DRIZZLE_SHOW_LOGS, isDev),
  },
  jwt: {
    privateKey: process.env.JWT_PRIVATE_KEY || 'change-me',
    defaultTtl: (process.env.JWT_DEFAULT_TTL || '1d') as StringValue,
  },
};

export function replaceConfig(newConfig: typeof Config) {
  Object.entries(newConfig).forEach(([key, value]) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    Config[key] = value;
  });
}

let stored: string | undefined = undefined;

export function storeConfig() {
  stored = JSON.stringify(Config);
}

export function restoreConfig() {
  if (stored) {
    replaceConfig(JSON.parse(stored));
  }
}
