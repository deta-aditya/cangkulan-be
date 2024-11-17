import { Result } from "@/common/result";
import { GameErrors } from "./game-error";

export class NumberOfPlayers {
  constructor(
    readonly value: number
  ) {}

  static MAXIMUM_VALUE = 6;

  static create(value: number) {
    return Result.validate(
      value > 0 && value <= NumberOfPlayers.MAXIMUM_VALUE, 
      () => new NumberOfPlayers(value),
      () => GameErrors.invalidNumberOfPlayers({
        actualValue: value,
        maximumValue: NumberOfPlayers.MAXIMUM_VALUE,
      }),
    );
  }
}
