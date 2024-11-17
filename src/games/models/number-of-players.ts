import { Result } from "@/common/result";
import { GameErrors } from "./game-error";

export class NumberOfPlayers {
  private constructor(
    readonly value: number
  ) {}

  static MAXIMUM_VALUE = 6;

  static create(value: number) {
    return Result.validate(
      value > 0 && value <= this.MAXIMUM_VALUE, 
      () => new NumberOfPlayers(value),
      () => GameErrors.invalidNumberOfPlayers({
        actualValue: value,
        maximumValue: this.MAXIMUM_VALUE,
      }),
    );
  }
}
