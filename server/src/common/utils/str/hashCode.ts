export function hashCode(str: string): string {
  return str
    .split('')
    .reduce(
      (prevHash, currVal) =>
        // eslint-disable-next-line no-bitwise
        ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
      0,
    )
    .toString(16);
}
