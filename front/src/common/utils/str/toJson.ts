export function toJson(obj: any, pretty = false): string {
  return pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
}
