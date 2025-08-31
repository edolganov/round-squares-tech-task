import { DateTime } from 'luxon';

export function get18YearsOld(): Date {
  return DateTime.now().minus({ year: 18 }).toJSDate();
}
