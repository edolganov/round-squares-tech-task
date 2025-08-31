import { Util } from '@/common/utils/Util.ts';

const { VITE_ENV, VITE_DEV_API_TIMEOUT } = import.meta.env;

const env = VITE_ENV || 'prod';
const isDev = env === 'dev';

export const Config = {
  isDev,
  devApiTimeout: isDev ? Util.parseInt(VITE_DEV_API_TIMEOUT, 0) : 0,
};
