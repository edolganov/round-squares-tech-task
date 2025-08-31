export interface WithTimeoutProps {
  callId: string;
  timeout: number;
}

export function withTimeout<T>(
  { callId, timeout }: WithTimeoutProps,
  call: () => Promise<T>,
): Promise<T> {
  return Promise.race<T>([
    call(),
    new Promise<T>((_resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`Timeout "${callId}": ${timeout}ms`));
      }, timeout);
    }),
  ]);
}
