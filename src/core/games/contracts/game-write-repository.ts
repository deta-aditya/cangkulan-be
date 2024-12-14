import { GameId } from "@/core/games/models/game-id.ts";
import { Game } from "@/core/games/models/game/game.ts";

export type GameWriteRepository = {
  saveGame(game: Game): Promise<GameId>;
};
