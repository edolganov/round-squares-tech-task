import { DateTime } from 'luxon';

export function dateFrom(val: any): Date | null {
  if (!val) return null;

  if (val instanceof Date) return val;

  const fromStandardFormat = new Date(val);
  if (!isNaN(fromStandardFormat.getTime())) return fromStandardFormat;

  const parsed = DateTime.fromISO(val);
  return parsed.isValid ? parsed.toJSDate() : null;
}
