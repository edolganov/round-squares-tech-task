import { dateFrom } from '../date/dateFrom';
import { DateTime } from 'luxon';

/** to "yyyy-mm-dd" format or empty string */
export function formatToISOYearDay(date: Date | string | number): string {
  const parsed = dateFrom(date);
  return parsed ? DateTime.fromJSDate(parsed).toISODate() || '' : '';
}
