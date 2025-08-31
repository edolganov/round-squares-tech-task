import { AppCard } from '@/components/AppCard';
import type { Round } from '@/generated/api';
import {
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { Timer } from '@/components/Timer';
import { getRoundStatus, type RoundStatus } from '@/common/model/round.ts';
import { memo, useCallback, useEffect, useState } from 'react';
import ButtonIcon from '@/assets/goose_icon.svg';
import { RestRound } from '@/api/round.ts';
import { RoundInfoByServer } from '@/features/round/components/RoundGameCard/RoundInfoByServer.tsx';
import { Util } from '@/common/utils/Util.ts';
import { getLastLogin } from '@/api/auth.ts';

function RoundGameCardRaw({
  isPending,
  round,
}: {
  isPending?: boolean;
  isError?: boolean;
  round?: Round;
}) {
  const cacheKey = `guss-game-clicks-${round?.id}-${getLastLogin()}`;
  const [, setForceUpdate] = useState(0);
  const [inGameClicksCache, setInGameClicksCache] = useState(
    Util.parseInt(localStorage.getItem(cacheKey), 0),
  );

  const navigate = useNavigate();
  const status = round ? getRoundStatus(round.startAt, round.endAt) : undefined;
  const disabled = status !== 'active';

  const onTimeout = useCallback(() => {
    setForceUpdate((val) => val + 1);
  }, []);

  const makeTap = useCallback(() => {
    if (round?.id && status === 'active') {
      setInGameClicksCache((value) => {
        const newValue = value + 1;
        localStorage.setItem(cacheKey, newValue.toString());
        return newValue;
      });
      RestRound.roundTapToRound({ roundId: round.id }).catch(console.error);
    }
  }, [cacheKey, round, status]);

  useEffect(() => {
    if (disabled) {
      localStorage.removeItem(cacheKey);
    }
  }, [cacheKey, disabled]);

  return (
    <AppCard
      title={getTitle(status)}
      action={
        <>
          <Button
            onClick={() => {
              navigate('/rounds');
            }}
          >
            Список раундов
          </Button>
        </>
      }
    >
      <Stack gap={1} sx={{ alignItems: 'center' }}>
        {isPending && <CircularProgress size={40} />}
        {round && (
          <Stack gap={1} sx={{ textAlign: 'center' }}>
            <IconButton
              disabled={disabled}
              onClick={makeTap}
              sx={{
                opacity: disabled ? 0.5 : undefined,
                filter: disabled ? 'grayscale(1)' : undefined,
              }}
            >
              <ButtonIcon />
            </IconButton>
            <Typography>{getStatusLabel(status)}</Typography>
            {status === 'cooldown' && (
              <Typography>
                {'До начала раунда: '}
                <Timer endTime={round.startAt} onTimeout={onTimeout} />
              </Typography>
            )}
            {status === 'active' && (
              <Stack gap={1} sx={{ textAlign: 'center' }}>
                <Typography>
                  {'До конца осталось: '}
                  <Timer endTime={round.endAt} onTimeout={onTimeout} />
                </Typography>
                <Typography>
                  {'Мои очки - '}
                  {calculateScoreByTaps(inGameClicksCache)}
                </Typography>
              </Stack>
            )}
            {status === 'done' && (
              <Stack gap={1} sx={{ textAlign: 'left' }}>
                <Divider />
                <RoundInfoByServer roundId={round?.id} />
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
    </AppCard>
  );
}

function calculateScoreByTaps(tapsCount: number): number {
  const bonusTaps = Math.floor(tapsCount / 11);
  return tapsCount + 9 * bonusTaps;
}

function getTitle(status: RoundStatus | undefined) {
  if (!status) return 'Загрузка...';
  if (status === 'cooldown') return 'Ожидание';
  if (status === 'active') return 'Играем Раунд!';
  return 'Раунд завершен';
}

function getStatusLabel(status: RoundStatus | undefined) {
  if (!status) return 'Загрузка...';
  if (status === 'cooldown') return 'Ожидание';
  if (status === 'active') return 'Раунд активен! Нажимай Гуся!';
  return 'Раунд завершен';
}

export const RoundGameCard = memo(RoundGameCardRaw);
