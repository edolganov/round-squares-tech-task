import { DateTime, type DurationLike } from 'luxon';

export function addDuration(date: Date, duration: DurationLike): Date {
  return DateTime.fromJSDate(date).plus(duration).toJSDate();
}
