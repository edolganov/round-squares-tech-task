export class ApiError extends Error {
  override name = 'ApiError' as const;
  public readonly status: number;
  public readonly data: Record<string, any>;
  constructor(msg: string, status: number, data?: Record<string, any>) {
    super(msg || '');
    this.status = status;
    this.data = data || {};
  }
}
