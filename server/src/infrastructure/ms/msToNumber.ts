import ms, { StringValue } from 'ms';
import { Util } from '../../common/utils/Util';

export function msToNumber(value: number | StringValue): number {
  if (Util.isString(value)) {
    return ms(value as StringValue);
  }
  return value as number;
}
