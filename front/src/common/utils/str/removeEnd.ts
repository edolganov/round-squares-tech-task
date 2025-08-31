export function removeEnd(str: string, last: string) {
  if (!str) return str;

  if (!str.endsWith(last)) return str;

  return str.substring(0, str.length - last.length);
}
