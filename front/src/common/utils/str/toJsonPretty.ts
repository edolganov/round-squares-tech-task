import { toJson } from './toJson';

export function toJsonPretty(obj: any): string {
  return toJson(obj, true);
}
