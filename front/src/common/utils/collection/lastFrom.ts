export function lastFrom(list?: Array<any>) {
  return list && list.length > 0 ? list[list.length - 1] : undefined;
}
