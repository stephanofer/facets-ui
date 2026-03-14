export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: { message: string }[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}
