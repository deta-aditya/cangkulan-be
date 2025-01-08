import { CreateGame } from "@/core/games/workflows/create-game/create-game.ts";
import type { CangkulanRepositories } from "@/core/cangkulan-repositories.ts";

export class CangkulanCore {
  constructor(
    private repositories: CangkulanRepositories,
  ) {}

  get createGame() {
    return new CreateGame(this.repositories.gameWrite);
  }
}
