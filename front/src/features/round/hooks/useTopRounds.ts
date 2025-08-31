import { useQuery } from '@tanstack/react-query';
import type { Round } from '@/generated/api';
import { RestRound } from '@/api/round.ts';

export function queryKeyTopRounds() {
  return ['top-rounds'];
}

export function useTopRounds() {
  return useQuery<Round[]>({
    queryKey: queryKeyTopRounds(),
    queryFn: async () => {
      return await RestRound.roundGetTopRounds();
    },
  });
}
