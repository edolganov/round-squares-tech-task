import { dateFrom } from '@/common/utils/date/dateFrom.ts';
import { DateTime } from 'luxon';
import { memo } from 'react';

function FormatDateRaw({ date }: { date: Date | string }) {
  const parsed = dateFrom(date);
  return parsed
    ? DateTime.fromJSDate(parsed).toFormat('yyyy.MM.dd, HH:mm:ss')
    : '';
}

export const FormatDate = memo(FormatDateRaw);
