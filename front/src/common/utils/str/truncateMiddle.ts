export function truncateMiddle(
  str: string,
  prefixSize: number,
  sufixSize?: number,
) {
  if (sufixSize === undefined) {
    sufixSize = prefixSize;
  }

  const showSize = prefixSize + sufixSize;
  if (str.length <= showSize) {
    return str;
  }

  return `${str.slice(0, prefixSize)}...${str.slice(-sufixSize)}`;
}
