import { usePageTitle } from '@/hooks/usePageTitle.ts';
import { useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';
import { useTopRounds } from '@/features/round/hooks/useTopRounds.ts';
import { RoundGameCard } from '@/features/round/components/RoundGameCard';

export function RoundGamePage() {
  usePageTitle('Раунд');

  const navigate = useNavigate();
  const { data: rounds, isError, isPending } = useTopRounds();
  const { roundId } = useParams();
  const round = rounds?.find((round) => round.id === roundId);
  const isUnknownRound = !!rounds && !round;

  useEffect(() => {
    if (isError || isUnknownRound) {
      navigate('/rounds');
    }
  }, [isError, navigate, isUnknownRound]);

  return <RoundGameCard isPending={isPending} round={round} />;
}
