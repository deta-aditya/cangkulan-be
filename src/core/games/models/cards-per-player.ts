import { GameErrors } from "./game-error.ts";
import { Result } from "@/core/common/result.ts";

export class CardsPerPlayer {
  constructor(
    readonly value: number,
  ) {}

  static MAXIMUM_VALUE = 9;

  static create(value: number) {
    return Result.validate(
      value > 0 && value <= CardsPerPlayer.MAXIMUM_VALUE,
      () => new CardsPerPlayer(value),
      () =>
        GameErrors.invalidCardsPerPlayer({
          actualValue: value,
          maximumValue: CardsPerPlayer.MAXIMUM_VALUE,
        }),
    );
  }
}
