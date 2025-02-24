import type { Option } from "@/core/common/option.ts";
import type { Game } from "@/core/games/models/game.ts";
import type { GameId } from "@/core/games/models/game-id.ts";
import type { Future } from "@/core/common/future.ts";
import type { CoreError } from "@/core/common/core-error.ts";

export type GameReadRepository = {
  findGameById(id: GameId): Future<Option<Game>, CoreError>;
}
