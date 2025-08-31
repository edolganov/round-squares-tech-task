import { isEmpty } from './isEmpty';

export function parseInt<T extends number | undefined = undefined>(
  obj: any,
  defaultVal?: T,
): T extends number ? number : number | undefined {
  if (isEmpty(obj)) {
    return defaultVal as any;
  }

  try {
    const out = Number.parseInt(obj, 10);

    return (isNaN(out) ? defaultVal : out) as any;
  } catch (e: any) {
    return defaultVal as any;
  }
}
