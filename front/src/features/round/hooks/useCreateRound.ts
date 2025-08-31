import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type CreateRoundReq, type Round } from '@/generated/api';
import { RestRound } from '@/api/round.ts';
import { queryKeyTopRounds } from '@/features/round/hooks/useTopRounds.ts';

export function useCreateRound() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: CreateRoundReq) => RestRound.roundCreateRound(req),
    onSuccess: (newRound) => {
      queryClient.setQueryData(queryKeyTopRounds(), (list: Round[]) => {
        return [newRound, ...list];
      });
    },
  });
}
