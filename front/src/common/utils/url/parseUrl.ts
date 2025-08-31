export function parseUrl(
  val: string | undefined,
  props?: {
    addProtocol?: boolean;
  },
): URL | null {
  if (props?.addProtocol) {
    val = !val || val.includes('://') ? val : `https://${val}`;
  }

  try {
    return val ? new URL(val) : null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: any) {
    return null;
  }
}
