import { GameErrors } from "./game-error.ts";
import { Result } from "@/core/common/result.ts";

export class CardsPerPlayer {
  constructor(
    readonly value: number,
  ) {}

  static MAXIMUM_VALUE = 9;

  static create(value: number) {
    const valueIsInteger = Number.isInteger(value);
    const valueIsOnRange = value > 0 && value <= CardsPerPlayer.MAXIMUM_VALUE;
    const valueIsValid = valueIsInteger && valueIsOnRange;

    return Result.validate(value, valueIsValid)
      .map(value => new CardsPerPlayer(value))
      .mapErr(() => GameErrors.invalidCardsPerPlayer({
        actualValue: value,
        maximumValue: CardsPerPlayer.MAXIMUM_VALUE,
      }));
  }
}
