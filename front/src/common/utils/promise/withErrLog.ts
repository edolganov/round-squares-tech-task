import { Util } from '../Util';

const log = Util.getLog('utils/promise/withErrLog');

export function withErrLog<T>(
  promise: Promise<T>,
  ...errors: any[]
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    promise
      .then((result) => resolve(result))
      .catch((e: any) => {
        log.error(...errors, e);
        reject(e as Error);
      });
  });
}
