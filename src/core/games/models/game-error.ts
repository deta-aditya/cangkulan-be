import { having, Infer, unionOf } from "../../common/union.ts";

export const GameErrors = unionOf({
  invalidCardsPerPlayer: having<
    { actualValue: number; maximumValue: number }
  >(),
  invalidNumberOfPlayers: having<
    { actualValue: number; maximumValue: number }
  >(),
  invalidPlayersAndCardsCombination: having<
    { cardsPerPlayer: number; numberOfPlayers: number }
  >(),
});

export type GameError = Infer<typeof GameErrors>;
