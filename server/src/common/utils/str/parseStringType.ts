export function parseStringType<T extends string>(
  checkMap: Record<T, any>,
  value: any,
  defaultVal: T,
) {
  return checkMap[value as T] ? (value as T) : defaultVal;
}
