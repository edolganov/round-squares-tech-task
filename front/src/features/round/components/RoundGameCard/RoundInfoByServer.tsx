import { useRoundInfo } from '@/features/round/hooks/useRoundInfo.ts';
import { Typography } from '@mui/material';
import { LabelValueRoot } from '@/components/LabelValue/LabelValueRoot.tsx';
import { LabelValueRow } from '@/components/LabelValue/LabelValueRow.tsx';
import { useEffect } from 'react';
import { getLastLogin } from '@/api/auth.ts';

export function RoundInfoByServer({ roundId }: { roundId?: string }) {
  const {
    data: serverInfo,
    isError: isErrorRoundInfo,
    refetch,
  } = useRoundInfo(getLastLogin(), roundId);

  const isUnknownInfo =
    isErrorRoundInfo || (!!roundId && !!serverInfo && !serverInfo.info);
  const info = serverInfo?.info;
  const hasGlobalStat = !!info && info.winner !== undefined;

  // wait global stat to create on server
  useEffect(() => {
    if (isUnknownInfo || hasGlobalStat) {
      return;
    }
    const interval = setInterval(() => {
      refetch().catch(console.error);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [refetch, isUnknownInfo, hasGlobalStat]);

  return (
    <>
      {isUnknownInfo && <Typography>Нет данных о результатах</Typography>}
      {!hasGlobalStat && <Typography>Обновление результатов...</Typography>}
      {hasGlobalStat && (
        <LabelValueRoot>
          <LabelValueRow labelText="Всего" valueText={info.totalScore} />
          <LabelValueRow
            labelText={`Победитель - ${info.winner || 'нет'}`}
            valueText={info.winnerScore}
          />
          <LabelValueRow labelText="Мои очки" valueText={info.userScore} />
        </LabelValueRoot>
      )}
    </>
  );
}
