import { having, Infer, unionOf } from "@/core/common/union";

export const GameErrors = unionOf({
  invalidCardsPerPlayer: having<{ actualValue: number, maximumValue: number }>(),
  invalidNumberOfPlayers: having<{ actualValue: number, maximumValue: number }>(),
  invalidPlayersAndCardsCombination: having<{ cardsPerPlayer: number, numberOfPlayers: number }>(),
});

export type GameError = Infer<typeof GameErrors>;
