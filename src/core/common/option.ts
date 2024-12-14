import { Result } from "./result.ts";

export abstract class Option<T> {
  abstract map<U>(mapper: (value: T) => U): Option<U>;
  abstract match<U>(cases: { some: (value: T) => U; none: () => U }): U;
  abstract isSome(): this is Some<T>;
  abstract isNone(): this is None<T>;
  abstract toResult<U>(ifNone: () => U): Result<T, U>;
  abstract and<U>(option: Option<U>): Option<U>;
  abstract andThen<U>(binder: (value: T) => Option<U>): Option<U>;
  abstract or(option: Option<T>): Option<T>;
  abstract orElse(binder: () => Option<T>): Option<T>;
  abstract peek(peeker: (value: T) => void): Option<T>;
  abstract unwrap(): T;
  abstract unwrapOrElse(ifNone: () => T): T;
  abstract unwrapOrNull(): T | null;

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

  static validate<T>(condition: boolean, ifTrue: () => T) {
    if (condition) {
      return Option.some(ifTrue());
    }
    return Option.none<T>();
  }
}

class Some<T> implements Option<T> {
  constructor(public readonly value: T) {}

  andThen<U>(binder: (value: T) => Option<U>): Option<U> {
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

  unwrap(): T {
    return this.value;
  }

  unwrapOrElse(): T {
    return this.value;
  }

  unwrapOrNull(): T | null {
    return this.value;
  }

  and<U>(option: Option<U>): Option<U> {
    return option;
  }

  or(_option: Option<T>): Option<T> {
    return this;
  }

  orElse(_binder: () => Option<T>): Option<T> {
    return this;
  }

  peek(peeker: (value: T) => void): Option<T> {
    peeker(this.value);
    return this;
  }
}

class None<T> implements Option<T> {
  andThen<U>(_binder: (value: T) => Option<U>): Option<U> {
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

  unwrap(): T {
    throw new Error("This Option value is not Some!");
  }

  unwrapOrElse(ifNone: () => T): T {
    return ifNone();
  }

  unwrapOrNull(): T | null {
    return null;
  }

  and<U>(_option: Option<U>): Option<U> {
    return Option.none();
  }

  or(option: Option<T>): Option<T> {
    return option;
  }

  orElse(binder: () => Option<T>): Option<T> {
    return binder();
  }

  peek(_peeker: (value: T) => void): Option<T> {
    return this;
  }
}
