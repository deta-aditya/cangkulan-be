import { Result } from "./result";

export abstract class Option<T> {
  abstract map<U>(mapper: (value: T) => U): Option<U>;
  abstract match<U>(cases: { some: (value: T) => U; none: () => U }): U;
  abstract isSome(): this is Some<T>;
  abstract isNone(): this is None<T>;
  abstract toResult<U>(ifNone: () => U): Result<T, U>;
  abstract bind<U>(binder: (value: T) => Option<U>): Option<U>;

  static some<T>(value: T) {
    return new Some(value);
  }

  static none<T>() {
    return new None<T>();
  }

  static fromNullable<T>(value: T | null | undefined) {
    if (value === null || value === undefined) {
      return Option.none<T>();
    }
    return Option.some(value);
  }

  static fromResult<T>(value: Result<T, unknown>) {
    return value.match<Option<T>>({
      ok: (val) => Option.some(val),
      err: () => Option.none(),
    });
  }

  static validate<T>(condition: boolean, value: () => T) {
    if (condition) {
      return Option.some(value());
    }
    return Option.none<T>();
  }
}

class Some<T> implements Option<T> {
  constructor(public readonly value: T) {}

  bind<U>(binder: (value: T) => Option<U>): Option<U> {
    return binder(this.value);
  }

  map<U>(mapper: (value: T) => U): Option<U> {
    return Option.some(mapper(this.value));
  }

  match<U>(cases: { some: (value: T) => U; none: () => U }): U {
    return cases.some(this.value);
  }

  isSome(): this is Some<T> {
    return true;
  }

  isNone(): this is None<T> {
    return false;
  }

  toResult<U>(): Result<T, U> {
    return Result.ok<T, U>(this.value);
  }
}

class None<T> implements Option<T> {
  bind<U>(binder: (value: T) => Option<U>): Option<U> {
    return Option.none();
  }

  map<U>(): Option<U> {
    return Option.none();
  }

  match<U>(cases: { some: (value: T) => U; none: () => U }): U {
    return cases.none();
  }

  isSome(): this is Some<T> {
    return false;
  }

  isNone(): this is None<T> {
    return true;
  }

  toResult<U>(ifNone: () => U): Result<T, U> {
    return Result.err(ifNone());
  }
}
