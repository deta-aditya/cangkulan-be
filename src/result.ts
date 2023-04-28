export type Result<T, U> =
  | Success<T>
  | Failure<U>

interface Success<T> {
  kind: 'success'
  data: T
}

interface Failure<T> {
  kind: 'failure'
  reason: T
}

export function Success<T>(data: T): Success<T> {
  return { kind: 'success', data }
}

export function Failure<T>(reason: T): Failure<T> {
  return { kind: 'failure', reason }
}

export function isSuccess<T, U>(result: Result<T, U>): result is Success<T> {
  return result.kind === 'success'
}

export function isFailure<T, U>(result: Result<T, U>): result is Failure<U> {
  return result.kind === 'failure'
}

export function when<T, U, R>(result: Result<T, U>, cases: {
  success: (data: T) => R,
  failure: (reason: U) => R
}) {
  if (isSuccess(result)) {
    return cases.success(result.data)
  }
  return cases.failure(result.reason)
}
