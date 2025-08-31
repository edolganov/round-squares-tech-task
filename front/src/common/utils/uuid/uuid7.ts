import { v7 } from 'uuid';

export function uuid7(): string {
  // from: https://www.ntietz.com/blog/til-uses-for-the-different-uuid-versions/
  // v7 generated from a timestamp and random data
  return v7();
}
