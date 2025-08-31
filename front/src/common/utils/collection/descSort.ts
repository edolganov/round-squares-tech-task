import { ascSort } from './ascSort';

export function descSort(a: any, b: any): number {
  return -1 * ascSort(a, b);
}
