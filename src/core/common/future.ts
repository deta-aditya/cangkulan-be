export class Future<T, U> {
  constructor(private promiseFn: () => Promise<T>) {}

  static of<T, U>(promiseFunc: () => Promise<T>) {
    return new Future<T, U>(promiseFunc);
  }

  static ofResolve<T, U>(value: T) {
    return new Future<T, U>(() => Promise.resolve(value))
  }

  mergeErr(mergerFn: (error: U) => T) {
    return new Future<T, U>(() => this.promiseFn().catch(mergerFn));
  }

  map<V>(mapperFn: (value: T) => V) {
    return new Future<V, U>(() => this.promiseFn().then(mapperFn));
  }

  mapErr<V>(mapperFn: (value: U) => V) {
    return new Future<T, V>(() => this.promiseFn()
      .catch(err => Promise.reject(mapperFn(err))));
  }

  bind<V>(binderFn: (value: T) => Future<V, U>) {
    return new Future<V, U>(() => this.promiseFn().then(binderFn).then(f => f.toPromise()))
  }

  bindAsync<V>(asyncFn: (value: T) => Promise<V>) {
    return new Future<V, U>(() => this.promiseFn().then(asyncFn));
  }

  tee(voidFn: (value: T) => void) {
    return new Future<T, U>(() => this.promiseFn().then(v => {
      voidFn(v);
      return v;
    }))
  }

  toPromise(thenFn?: (value: T) => Promise<T>) {
    return this.promiseFn().then(thenFn);
  }
}
