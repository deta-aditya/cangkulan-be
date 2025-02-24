import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect/expect";
import { Future } from "@/core/common/future.ts";

describe('Future', () => {
  it('should convert promised function and convert back to promise', () => {
    const future = Future.of(() => Promise.resolve('Hello'));
    expect(future.toPromise()).resolves.toBe('Hello');
  });

  it('should convert resolved value and convert back to promise', () => {
    const future = Future.ofResolve('Hello');
    expect(future.toPromise()).resolves.toBe('Hello');
  });
});
