import type { QueryClient } from '@tanstack/react-query';
import { Util } from '@/common/utils/Util.ts';

const log = Util.getLog('react-query');

export async function invalidateQueries(
  queryClient: QueryClient,
  ...queryKeys: any[][]
) {
  const totalCaches = new Set<string>();
  const foundCaches = new Set<string>();

  return Promise.all(
    queryKeys.map((key) => {
      return queryClient.invalidateQueries({
        predicate: ({ queryHash }) => {
          totalCaches.add(queryHash);
          const keyHash = JSON.stringify(key);
          const found = keyHash === queryHash;
          if (found) {
            foundCaches.add(queryHash);
          }
          return found;
        },
      });
    }),
  ).then(() => {
    log.info(
      `invalidate queries: total: ${totalCaches.size}, invalidated: ${foundCaches.size}`,
      Array.from(foundCaches),
    );
    return Promise.resolve();
  });
}
