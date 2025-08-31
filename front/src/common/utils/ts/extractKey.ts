export function extractKey<T, K extends Extract<keyof T, string>>(
  _o: T,
  k: K,
): K {
  return k;
}
