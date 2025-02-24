import { GameErrors } from "@/core/games/models/game-error.ts";
import { Integer } from "@/core/common/number.ts";
import { Option } from "@/core/common/option.ts";

export class NumberOfPlayers extends Integer {
  constructor(readonly value: number) {
    super()
  }

  static MAXIMUM_VALUE = 6;

  static create(value: number) {
    return Option
      .some(value)
      .filter(isValueValid)
      .map(createNumberOfPlayers)
      .toResult(createGameError(value));
  }

  int(): number {
    return this.value;  
  }
}

const isValueValid = (value: number) => {
  const valueIsInteger = Number.isInteger(value);
  const valueIsOnRange = value > 0 && value <= NumberOfPlayers.MAXIMUM_VALUE;
  return valueIsInteger && valueIsOnRange;
};

const createNumberOfPlayers = (value: number) =>
  new NumberOfPlayers(value);

const createGameError = (actualValue: number) => () =>
  GameErrors.invalidNumberOfPlayers({
    actualValue: actualValue,
    maximumValue: NumberOfPlayers.MAXIMUM_VALUE,
  });
