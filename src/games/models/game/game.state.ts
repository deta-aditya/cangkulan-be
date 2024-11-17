import { having, Infer, unionOf } from "@/common/union";
import { Player } from "../player";
import { NumberOfPlayers } from "../number-of-players";
import { CardsPerPlayer } from "../cards-per-player";

export const GameStates = unionOf({
  waitingForPlayers: having<{ 
    players: Player[];
    numberOfPlayers: NumberOfPlayers;
    cardsPerPlayer: CardsPerPlayer;
  }>()
});

export type GameState = Infer<typeof GameStates>;
