import { isEmpty } from './isEmpty';

export function parseBool(obj: any, defVal?: boolean): boolean {
  if (typeof obj == 'boolean') {
    return obj;
  }

  const strVal = obj?.toString().toLowerCase();

  if (isEmpty(strVal)) return defVal || false;

  return strVal === 'true';
}
