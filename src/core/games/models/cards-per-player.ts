import { GameErrors } from "@/core/games/models/game-error.ts";
import { Integer } from "@/core/common/number.ts";
import { Option } from "@/core/common/option.ts";

export class CardsPerPlayer extends Integer {
  constructor(readonly value: number) {
    super();
  }

  static MAXIMUM_VALUE = 9;

  static create(value: number) {
    return Option
      .some(value)
      .filter(isValueValid)
      .map(createCardsPerPlayer)
      .toResult(createGameError(value));
  }

  int(): number {
    return this.value;  
  }
}

const isValueValid = (value: number) => {
  const valueIsInteger = Number.isInteger(value);
  const valueIsOnRange = value > 0 && value <= CardsPerPlayer.MAXIMUM_VALUE;
  return valueIsInteger && valueIsOnRange;
};

const createCardsPerPlayer = (value: number) => 
  new CardsPerPlayer(value)  

const createGameError = (actualValue: number) => () => 
  GameErrors.invalidCardsPerPlayer({
    actualValue: actualValue,
    maximumValue: CardsPerPlayer.MAXIMUM_VALUE,
  });
