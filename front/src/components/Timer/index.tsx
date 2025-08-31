import { memo, useEffect, useState } from 'react';
import { DateUtil } from '@/common/utils/DateUtil.ts';
import { Duration } from 'luxon';

function TimerRaw({
  endTime,
  onTimeout,
}: {
  endTime: string;
  onTimeout?: () => void;
}) {
  const endSecs = Math.floor(
    (DateUtil.dateFrom(endTime)?.getTime() || 0) / 1000,
  );
  const initSecs = Math.max(0, endSecs - Math.floor(Date.now() / 1000));
  const [seconds, setSeconds] = useState(initSecs);

  useEffect(() => {
    const interval = setInterval(() => {
      const nowSec = Math.floor(Date.now() / 1000);
      const delta = Math.max(0, endSecs - nowSec);
      setSeconds(delta);
      if (delta <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [endSecs]);

  useEffect(() => {
    if (seconds === 0) {
      onTimeout?.();
    }
  }, [onTimeout, seconds]);

  return formatSeconds(seconds);
}

function formatSeconds(seconds: number) {
  return Duration.fromObject({ seconds }).toFormat('mm:ss');
}

export const Timer = memo(TimerRaw);
