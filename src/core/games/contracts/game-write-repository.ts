import { GameId } from "../models/game-id";
import { Game } from "../models/game/game";

export type GameWriteRepository = {
  saveGame(game: Game): Promise<GameId>; 
};
