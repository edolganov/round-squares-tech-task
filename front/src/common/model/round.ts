import { DateUtil } from '@/common/utils/DateUtil.ts';

export type RoundStatus = 'cooldown' | 'active' | 'done';

export function getRoundStatus(startAt: string, endAt: string): RoundStatus {
  const nowSec = Math.floor(Date.now() / 1000);
  const startSec = Math.floor(
    (DateUtil.dateFrom(startAt)?.getTime() || 0) / 1000,
  );
  if (startSec && nowSec < startSec) {
    return 'cooldown';
  }
  const endSec = Math.floor((DateUtil.dateFrom(endAt)?.getTime() || 0) / 1000);
  // stealing one game's sec from UI to correct local score view
  const validEndSec = Math.max(0, endSec - 1);
  if (validEndSec && nowSec < validEndSec) {
    return 'active';
  }
  return 'done';
}
