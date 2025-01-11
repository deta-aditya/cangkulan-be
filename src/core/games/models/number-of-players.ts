import { Result } from "@/core/common/result.ts";
import { GameErrors } from "./game-error.ts";

export class NumberOfPlayers {
  constructor(
    readonly value: number,
  ) {}

  static MAXIMUM_VALUE = 6;

  static create(value: number) {
    const valueIsInteger = Number.isInteger(value);
    const valueIsOnRange = value > 0 && value <= NumberOfPlayers.MAXIMUM_VALUE;
    const valueIsValid = valueIsInteger && valueIsOnRange;

    return Result.validate(value, valueIsValid)
      .map(value => new NumberOfPlayers(value))
      .mapErr(() => GameErrors.invalidNumberOfPlayers({
        actualValue: value,
        maximumValue: NumberOfPlayers.MAXIMUM_VALUE,
      }));
  }
}
