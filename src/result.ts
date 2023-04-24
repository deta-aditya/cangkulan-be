type ResultState<T, U> =
  | { kind: 'success', data: T }
  | { kind: 'failure', failure: U }

export class Result<TData, TFailure> {
  value: ResultState<TData, TFailure>

  private constructor(value: ResultState<TData, TFailure>) {
    this.value = value
  }

  static success<TNewData, TNewFailure>(data: TNewData) {
    return new Result<TNewData, TNewFailure>({ kind: 'success', data })
  }

  static failure<TNewData, TNewFailure>(failure: TNewFailure) {
    return new Result<TNewData, TNewFailure>({ kind: 'failure', failure })
  }

  then<TNewData>(func: (value: Result<TData, TFailure>) => Result<TNewData, TFailure>): Result<TNewData, TFailure> {
    switch (this.value.kind) {
      case "success":
        return func(this)
      case "failure":
        return Result.failure(this.value.failure)
    }
  }

  when<TReturn>(cases: { success: (data: TData) => TReturn; failure: (failure: TFailure) => TReturn }) {
    switch (this.value.kind) {
      case "success":
        return cases.success(this.value.data)
      case "failure":
        return cases.failure(this.value.failure)
    }
  }
}