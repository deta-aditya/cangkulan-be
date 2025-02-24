import { having, Infer, unionOf } from "@/core/common/union.ts";
import { Player } from "@/core/games/models/player.ts";
import { NumberOfPlayers } from "@/core/games/models/number-of-players.ts";
import { CardsPerPlayer } from "@/core/games/models/cards-per-player.ts";

export const GameStates = unionOf({
  waitingForPlayers: having<{
    players: Player[];
    numberOfPlayers: NumberOfPlayers;
    cardsPerPlayer: CardsPerPlayer;
  }>(),
  readyToPlay: having<{
    players: Player[];
    numberOfPlayers: NumberOfPlayers;
    cardsPerPlayer: CardsPerPlayer;
  }>(),
});

export type GameState = Infer<typeof GameStates>;
