import { Util } from '../Util';

const log = Util.getLog('utils/promise/withRetry');

export interface WithRetryProps {
  maxCalls?: number;
  retryTimeout?: number;
  name?: string;
  stopTrying?: (e: any) => Promise<boolean> | boolean;
}

export function withRetry<F extends (...args: any) => Promise<any>>(
  fn: F,
  props?: WithRetryProps,
): (...args: Parameters<F>) => ReturnType<F> {
  const maxCalls = props?.maxCalls && props.maxCalls > 1 ? props.maxCalls : 1;
  const timeout = props?.retryTimeout || 2000;
  const name = props?.name || '';
  const stopTrying = props?.stopTrying;

  const proxyFn = async (...args: any[]) => {
    let call = 0;
    let lastError;

    while (call < maxCalls) {
      try {
        return await fn(...args);
      } catch (e) {
        call++;
        if (call < maxCalls) {
          if (await stopTrying?.(e)) {
            throw e;
          }

          log.warn(`Cannot invoke [${name}]. Retry after ${timeout}...`);
          await Util.timeout(timeout);
        }
        lastError = e;
      }
    }

    // no more retries
    throw lastError;
  };

  return proxyFn as any;
}
