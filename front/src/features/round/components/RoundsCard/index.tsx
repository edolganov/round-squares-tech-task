import { AppCard } from '@/components/AppCard';
import { isAdminRole } from '@/api/auth.ts';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useCreateRound } from '@/features/round/hooks/useCreateRound.ts';
import { useTopRounds } from '@/features/round/hooks/useTopRounds.ts';
import { RoundCard } from '@/features/round/components/RoundsCard/RoundCard.tsx';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function RoundsCard() {
  const navigate = useNavigate();
  const { data: rounds, isPending, isError } = useTopRounds();
  const {
    mutate: createRound,
    isPending: isPendingCreateRound,
    isSuccess: isRoundCreated,
    data: createdRoundData,
    reset: resetCreateData,
  } = useCreateRound();

  const isAdmin = isAdminRole();

  useEffect(() => {
    if (isRoundCreated && createdRoundData) {
      resetCreateData();
      navigate(`/rounds/${createdRoundData.id}`);
    }
  }, [isRoundCreated, navigate, createdRoundData, resetCreateData]);

  return (
    <AppCard title="Список РАУНДОВ">
      <Stack gap={3}>
        {isAdmin && (
          <Box>
            <Button
              disabled={isPendingCreateRound}
              loading={isPendingCreateRound}
              loadingPosition="end"
              onClick={() => createRound({})}
            >
              Создать раунд
            </Button>
          </Box>
        )}
        {isError && (
          <Typography>Не удалось загрузить список раундов</Typography>
        )}
        {isPending && (
          <Stack sx={{ alignItems: 'center', width: '100%' }}>
            <CircularProgress size={40} />
          </Stack>
        )}
        {rounds && rounds.length === 0 && (
          <Typography>Нет активных раундов</Typography>
        )}
        {rounds?.map((round) => (
          <RoundCard key={round.id} round={round} />
        ))}
      </Stack>
    </AppCard>
  );
}
