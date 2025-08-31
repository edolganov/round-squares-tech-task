import { isEmpty } from './isEmpty';

export function parseFloat(obj: any, defaultVal?: number): number | undefined {
  if (isEmpty(obj)) return defaultVal;

  try {
    const out = Number.parseFloat(obj);
    return isNaN(out) ? defaultVal : out;
  } catch (e: any) {
    return defaultVal;
  }
}
