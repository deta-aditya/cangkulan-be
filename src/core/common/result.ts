type LiftParams<T, U> = {
  [I in keyof T]: Result<T[I], U>;
};

type OkCase<T extends Result<unknown, unknown>> = 
  T extends Result<infer U, unknown> ? U : never;

type ErrCase<T extends Result<unknown, unknown>> = 
  T extends Result<unknown, infer U> ? U : never;

export abstract class Result<T, U> {
  abstract map<S>(mapper: (value: T) => S): Result<S, U>;
  abstract mapErr<V>(mapper: (value: U) => V): Result<T, V>;
  abstract bind<S>(binder: (value: T) => Result<S, U>): Result<S, U>;
  abstract match<V>(cases: { ok: (value: T) => V; err: (value: U) => V }): V;
  abstract isOk(): this is Ok<T, U>;
  abstract isErr(): this is Err<T, U>;
  abstract toPromise(): Promise<T>;
  abstract unwrap(): T;
  abstract unwrapErr(): U;
  abstract unwrapOrElse(ifErr: () => T): T;
  abstract unwrapErrOrElse(ifOk: () => U): U;

  static ok<T, U>(value: T): Result<T, U> {
    return new Ok<T, U>(value);
  }

  static err<T, U>(value: U): Result<T, U> {
    return new Err<T, U>(value);
  }

  static collectArray<T, U>(array: Array<Result<T, U>>): Result<Array<T>, U> {
    return array.reduce((acc, item) =>
      acc.bind((currentArrayValue) =>
        item.match({
          err: (errValue) => Result.err<Array<T>, U>(errValue),
          ok: (okValue) => Result.ok([...currentArrayValue, okValue]),
        }),
      ),
      Result.ok<Array<T>, U>([]),
    );
  }

  static collectObject<T extends Record<string, unknown>, U>(
    object: {
      [K in keyof T]: Result<T[K], U>;
    },
  ): Result<T, U> {
    return Object.entries(object).reduce(
      (acc, entry) => {
        const [key, value] = entry as [keyof T, Result<T[keyof T], U>];

        return acc.bind((currentObjectValue) =>
          value.match({
            err: (errValue) => Result.err<T, U>(errValue),
            ok: (okValue) => Result.ok({ ...currentObjectValue, [key]: okValue }),
          }),
        );
      },
      Result.ok<T, U>({} as T),
    );
  }

  static liftBind<
    T extends (...args: any[]) => Result<any, V>,
    U extends Parameters<T>, 
    V,
  >(func: T, ...params: LiftParams<U, V>): ReturnType<T> {
    return this.collectArray(params).bind(params => func(...params)) as ReturnType<T>;
  }

  static try<T>(errorneusProcess: () => T): Result<T, unknown> {
    try {
      const result = errorneusProcess();
      return Result.ok(result);
    } catch (error) {
      return Result.err(error);
    }
  }

  static validate<T, U>(condition: boolean, ifTrue: () => T, ifFalse: () => U) {
    if (condition) {
      return Result.ok<T, U>(ifTrue());
    }
    return Result.err<T, U>(ifFalse());
  }
}

class Ok<T, U> implements Result<T, U> {
  constructor(public readonly value: T) {}

  isOk(): this is Ok<T, U> {
    return true;
  }

  isErr(): this is Err<T, U> {
    return false;
  }

  map<S>(mapper: (value: T) => S): Result<S, U> {
    return Result.ok(mapper(this.value));
  }

  mapErr<V>(): Result<T, V> {
    return Result.ok(this.value);
  }

  bind<S>(binder: (value: T) => Result<S, U>): Result<S, U> {
    return binder(this.value);
  }

  match<V>(cases: { ok: (value: T) => V; err: (value: U) => V }): V {
    return cases.ok(this.value);
  }

  toPromise(): Promise<T> {
    return Promise.resolve(this.value);
  }

  unwrap(): T {
    return this.value;
  }

  unwrapErr(): U {
    throw new Error('This Result value is not Err!');
  }

  unwrapErrOrElse(ifOk: () => U): U {
    return ifOk();
  }

  unwrapOrElse(ifErr: () => T): T {
    return this.value;
  }
}

class Err<T, U> implements Result<T, U> {
  constructor(public readonly value: U) {}

  isOk(): this is Ok<T, U> {
    return false;
  }

  isErr(): this is Err<T, U> {
    return true;
  }

  map<S>(): Result<S, U> {
    return Result.err(this.value);
  }

  mapErr<V>(mapper: (value: U) => V): Result<T, V> {
    return Result.err(mapper(this.value));
  }

  bind<S>(): Result<S, U> {
    return Result.err(this.value);
  }

  match<V>(cases: { ok: (value: T) => V; err: (value: U) => V }): V {
    return cases.err(this.value);
  }

  toPromise(): Promise<T> {
    return Promise.reject(this.value);
  }

  unwrap(): T {
    throw new Error('This Result value is not Ok!');
  }
  
  unwrapErr(): U {
    return this.value;
  }

  unwrapErrOrElse(ifOk: () => U): U {
    return this.value;
  }

  unwrapOrElse(ifErr: () => T): T {
    return ifErr();
  }
}