import { Util } from '../../common/utils/Util';

const log = Util.getLog('infrastructure/server');

export function initUncaughtException() {
  process.on('uncaughtException', (err) => {
    log.error(`Uncaught exception: \n`, err);
  });
}
