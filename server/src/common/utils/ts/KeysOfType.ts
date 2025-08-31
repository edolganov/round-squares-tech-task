/**
 * From: https://stackoverflow.com/a/66565852/7357077
 */
export type KeysOfType<U extends string, R extends string[] = []> = {
  [S in U]: Exclude<U, S> extends never
    ? [...R, S]
    : KeysOfType<Exclude<U, S>, [...R, S]>;
}[U] &
  string[];
