export function replaceAll(str: string, token: string, newToken: string) {
  return str.split(token).join(newToken);
}
