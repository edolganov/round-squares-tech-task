import type { Round } from '@/generated/api';
import { Box, Divider, Link, Stack, Typography } from '@mui/material';
import { colorPath } from '@/infrastructure/material/colorPath.ts';
import { useNavigate } from 'react-router';
import { FormatDate } from '@/components/FormatDate';
import { LabelValueRoot } from '@/components/LabelValue/LabelValueRoot.tsx';
import { LabelValueRow } from '@/components/LabelValue/LabelValueRow.tsx';
import { getRoundStatus, type RoundStatus } from '@/common/model/round.ts';
import { useUpdateStatusByTime } from '@/features/round/components/RoundsCard/hooks/useUpdateStatusByTime.ts';

export function RoundCard({ round }: { round: Round }) {
  const navigate = useNavigate();
  const status = getRoundStatus(round.startAt, round.endAt);

  useUpdateStatusByTime(round, status);

  return (
    <Stack
      gap={1}
      sx={{
        border: 1,
        borderRadius: 1,
        borderColor: colorPath('grey.500'),
        p: 1,
        py: 2,
      }}
    >
      <Typography>
        Раунд:
        <Box component="span" sx={{ width: 10, display: 'inline-block' }} />
        <Link
          component="button"
          onClick={() => {
            navigate(`/rounds/${round.id}`);
          }}
        >
          {round.id}
        </Link>
      </Typography>
      <LabelValueRoot sx={{ width: 250 }}>
        <LabelValueRow
          labelText="Начало"
          valueElem={<FormatDate date={round.startAt} />}
        />
        <LabelValueRow
          labelText="Конец"
          valueElem={<FormatDate date={round.endAt} />}
        />
      </LabelValueRoot>
      <Divider />
      <LabelValueRoot sx={{ width: 250 }}>
        <LabelValueRow labelText="Статус" valueText={getStatusLabel(status)} />
        {round.winner && (
          <LabelValueRow labelText="Победитель" valueText={round.winner} />
        )}
      </LabelValueRoot>
    </Stack>
  );
}

function getStatusLabel(status: RoundStatus) {
  if (status === 'cooldown') {
    return 'Ожидание';
  }
  if (status === 'active') {
    return 'Активен';
  }
  return 'Завершен';
}
