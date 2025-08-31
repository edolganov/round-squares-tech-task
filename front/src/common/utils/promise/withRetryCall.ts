import { withRetry, type WithRetryProps } from '../promise/withRetry';

export async function withRetryCall<T>(
  fn: () => Promise<T>,
  props?: WithRetryProps,
): Promise<T> {
  return withRetry(fn, props)();
}
