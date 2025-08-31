import type { QueryClient } from '@tanstack/react-query';
import { invalidateQueries } from '@/infrastructure/react-query/invalidateQueries.ts';
import { Util } from '@/common/utils/Util.ts';

export function invalidateQueriesAsync(
  queryClient: QueryClient,
  ...queryKeys: any[][]
) {
  invalidateQueries(queryClient, ...queryKeys).catch(Util.onAsyncErr);
}
