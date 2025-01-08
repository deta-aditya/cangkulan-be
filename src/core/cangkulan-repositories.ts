import type { GameReadRepository } from "@/core/games/contracts/game-read-repository.ts";
import type { GameWriteRepository } from "@/core/games/contracts/game-write-repository.ts";

export type CangkulanRepositories = {
  gameRead: GameReadRepository;
  gameWrite: GameWriteRepository;
};
