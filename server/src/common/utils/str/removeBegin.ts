export function removeBegin(str: string, ...anyFirst: string[]) {
  if (!str) return str;

  let cur;
  for (let i = 0; i < anyFirst.length; i++) {
    cur = anyFirst[i];
    if (!cur) continue;

    if (!str.startsWith(cur)) continue;

    return str.substring(cur.length);
  }

  return str;
}
