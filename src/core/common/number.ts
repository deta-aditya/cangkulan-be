import type { Boolean } from "@/core/common/boolean.ts";
import { GreaterThan, Orders, type Comparable, type Order } from "@/core/common/order.ts";

export abstract class Integer implements Comparable<Integer> {
  abstract int(): number;

  compare(otherValue: Integer): Order {
    if (this.int() > otherValue.int()) {
      return Orders.greater();
    }
    if (this.int() < otherValue.int()) {
      return Orders.less();
    }
    return Orders.equals();
  }
};

export class IsInteger implements Boolean {
  constructor(private number: number) {}

  bool(): boolean {
    return Number.isInteger(this.number);
  }
}

export class IsNonZero implements Boolean {
  private condition: Boolean;

  constructor(number: number) {
    this.condition = new GreaterThan(
      new LiteralInteger(number), 
      new LiteralInteger(0),
    );
  }

  bool(): boolean {
    return this.condition.bool();
  }
}

export class LiteralInteger extends Integer {
  constructor(private integer: number) {
    super();
  }

  int(): number {
    return this.integer;
  }
}

export class Mult extends Integer {
  constructor(private thisValue: Integer, private thatValue: Integer) {
    super();
  }

  int(): number {
    return this.thisValue.int() * this.thatValue.int();
  }
}
