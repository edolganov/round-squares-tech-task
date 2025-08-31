import { DateTime } from 'luxon';
import { dateFrom } from '../date/dateFrom';

export function toDateTime(date: any): DateTime | undefined {
  const parsed = dateFrom(date);
  return parsed ? DateTime.fromJSDate(parsed) : undefined;
}
