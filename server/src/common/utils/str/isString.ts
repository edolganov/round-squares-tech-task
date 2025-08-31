import { isEmpty } from '../lang/isEmpty';

export function isString(obj: any) {
  return !isEmpty(obj) && typeof obj === 'string';
}
