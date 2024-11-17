import { Game } from "../models/game/game";

type GameId = string;

export type GameWriteDataGateway = {
  saveGame: (game: Game) => Promise<GameId>; 
};
