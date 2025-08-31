import { dateFrom } from '../date/dateFrom';
import { DateTime } from 'luxon';

/**
 yyyy.MM.dd HH:mm or empty string
 */
export function formatToDateAndTime(date: Date | string | number): string {
  const parsed = dateFrom(date);
  return parsed
    ? DateTime.fromJSDate(parsed).toFormat('yyyy.MM.dd, HH:mm')
    : '';
}
