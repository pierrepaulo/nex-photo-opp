export class AppError extends Error {
  public readonly statusCode: number;
  public readonly error: string;
  public readonly internalCode?: string;

  constructor(error: string, message: string, statusCode: number, internalCode?: string) {
    super(message);
    this.error = error;
    this.statusCode = statusCode;
    this.internalCode = internalCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
