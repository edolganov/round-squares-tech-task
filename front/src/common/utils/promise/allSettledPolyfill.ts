// from: https://medium.com/@95yashsharma/polyfill-for-promise-allsettled-965f9f2a003
// support for old browsers
export function initPolyfillForPromiseAllSettled() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (Promise.allSettled) return;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Promise.allSettled = function impl(promises: Promise<any>[]) {
    const mappedPromises = promises.map((p: Promise<any>) => {
      return p
        .then((value: any) => {
          return {
            status: 'fulfilled',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value,
          };
        })
        .catch((reason: any) => {
          return {
            status: 'rejected',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            reason,
          };
        });
    });
    return Promise.all(mappedPromises);
  };
}
