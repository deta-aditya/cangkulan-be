import { Game } from "../models/game/game";

type GameId = string;

export type GameWriteRepository = {
  saveGame: (game: Game) => Promise<GameId>; 
};
