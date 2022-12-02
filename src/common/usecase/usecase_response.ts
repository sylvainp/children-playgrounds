export default class UsecaseResponse<T> {
  private constructor(
    private readonly _error: Error | null,
    private readonly _result: T | null
  ) {}

  static fromResult<T>(result: T): UsecaseResponse<T> {
    return new UsecaseResponse(null, result);
  }

  static fromError<T>(error: Error): UsecaseResponse<T> {
    return new UsecaseResponse(error, null!);
  }

  get result(): T | null {
    return this._result;
  }

  get error(): Error | null {
    return this._error;
  }
}
