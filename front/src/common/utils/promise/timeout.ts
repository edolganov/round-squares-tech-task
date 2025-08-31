export async function timeout(ms: number, ...result: any[]): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms, ...result));
}
