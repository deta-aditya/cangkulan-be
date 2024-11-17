import { GameErrors } from "./game-error";
import { Result } from "@/common/result";

export class CardsPerPlayer {
  private constructor(
    readonly value: number
  ) {}

  static MAXIMUM_VALUE = 9;

  static create(value: number) {
    return Result.validate(
      value > 0 && value <= this.MAXIMUM_VALUE, 
      () => new CardsPerPlayer(value),
      () => GameErrors.invalidCardsPerPlayer({
        actualValue: value,
        maximumValue: this.MAXIMUM_VALUE,
      }),
    );
  }
}
