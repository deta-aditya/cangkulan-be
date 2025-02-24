import { And, BooleanLiteral, type Boolean } from "@/core/common/boolean.ts";
import { hasNothing, unionOf, type Infer } from "@/core/common/union.ts";

export const Orders = unionOf({
  equals: hasNothing(),
  less: hasNothing(),
  greater: hasNothing(),
});

export type Order = Infer<typeof Orders>;

export interface Comparable<T> {
  compare(otherValue: Comparable<T>): Order
}


export class GreaterThan<T> implements Boolean {
  constructor(private thisValue: Comparable<T>, private thatValue: Comparable<T>) {}

  bool(): boolean {
    return Orders.isGreater(this.thisValue.compare(this.thatValue));
  }
}

export class LesserThanEquals<T> implements Boolean {
  private resultingBool: Boolean;

  constructor(thisValue: Comparable<T>, thatValue: Comparable<T>) {
    const comparison = thisValue.compare(thatValue);

    this.resultingBool = new And(
      new BooleanLiteral(
        Orders.isLess(comparison)
      ),
      new BooleanLiteral(
        Orders.isEquals(comparison)
      )
    )
  }

  bool(): boolean {
    return this.resultingBool.bool();
  }
}
