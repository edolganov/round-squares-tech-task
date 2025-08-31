import type { Round } from '@/generated/api';
import { useEffect, useState } from 'react';
import { DateUtil } from '@/common/utils/DateUtil.ts';
import type { RoundStatus } from '@/common/model/round.ts';

export function useUpdateStatusByTime(round: Round, status: RoundStatus) {
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    if (status === 'done') {
      return;
    }
    const updateDate = status === 'cooldown' ? round.startAt : round.endAt;
    const updateTime = DateUtil.dateFrom(updateDate)?.getTime() || 0;
    const timeout = Math.max(0, updateTime - Date.now());
    if (timeout === 0) {
      return;
    }

    const validTimeout = timeout + 100;
    const timerId = setTimeout(
      () => setForceUpdate((val) => val + 1),
      validTimeout,
    );
    return () => {
      clearTimeout(timerId);
    };
  }, [status, round]);
}
