import { useQuery } from '@tanstack/react-query';
import type { GetRoundInfoResp } from '@/generated/api';
import { RestRound } from '@/api/round.ts';

export function queryKeyRoundInfo(
  login: string | undefined,
  roundId: string | undefined,
) {
  return ['round-info', login || '', roundId || ''];
}

export function useRoundInfo(
  login: string | undefined,
  roundId: string | undefined,
) {
  return useQuery<GetRoundInfoResp>({
    queryKey: queryKeyRoundInfo(login, roundId),
    queryFn: async () => {
      if (!roundId) {
        return {};
      }
      return await RestRound.roundGetRoundInfo(roundId);
    },
  });
}
