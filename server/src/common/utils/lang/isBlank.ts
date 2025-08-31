export function isBlank(str: string | undefined | null) {
  return str === null || str === undefined || str.length === 0;
}
