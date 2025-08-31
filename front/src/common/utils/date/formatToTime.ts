import { dateFrom } from '../date/dateFrom';
import { DateTime } from 'luxon';

/**
 HH:mm or empty string
 */
export function formatToTime(date: Date | string | number): string {
  const parsed = dateFrom(date);
  return parsed ? DateTime.fromJSDate(parsed).toFormat('HH:mm') : '';
}
