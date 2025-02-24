import { GameId } from "@/core/games/models/game-id.ts";
import type { Future } from "@/core/common/future.ts";
import type { CoreError } from "@/core/common/core-error.ts";
import { Game } from "@/core/games/models/game.ts";

export type GameWriteRepository = {
  saveGame(game: Game): Future<GameId, CoreError>;
};
