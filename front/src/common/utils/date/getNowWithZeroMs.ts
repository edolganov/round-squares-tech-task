export function getNowWithZeroMs() {
  const date = new Date();
  date.setMilliseconds(0);
  return date;
}
