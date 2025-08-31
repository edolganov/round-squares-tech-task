import { getLog } from '../log';

export function onAsyncErr(e: any) {
  getLog('Util').error('async error', e);
}
