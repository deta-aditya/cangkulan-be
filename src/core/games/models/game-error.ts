import { having, Infer, unionOf } from "@/core/common/union.ts";
import type { GameId } from "@/core/games/models/game-id.ts";

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
  gameNotFound: having<{ gameId: GameId }>(),
});

export type GameError = Infer<typeof GameErrors>;
