export class ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;

  constructor(
    statusCode: number,
    data: T,
    message = 'Success',
    meta?: Record<string, unknown>,
  ) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }
}
